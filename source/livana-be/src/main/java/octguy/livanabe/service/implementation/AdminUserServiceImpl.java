package octguy.livanabe.service.implementation;

import octguy.livanabe.dto.request.UpdateUserRolesRequest;
import octguy.livanabe.dto.request.UpdateUserStatusRequest;
import octguy.livanabe.dto.response.AdminUserResponse;
import octguy.livanabe.entity.Role;
import octguy.livanabe.entity.RoleUser;
import octguy.livanabe.entity.User;
import octguy.livanabe.entity.UserProfile;
import octguy.livanabe.enums.UserRole;
import octguy.livanabe.enums.UserStatus;
import octguy.livanabe.exception.ResourceNotFoundException;
import octguy.livanabe.repository.RoleRepository;
import octguy.livanabe.repository.UserProfileRepository;
import octguy.livanabe.repository.UserRepository;
import octguy.livanabe.service.IAdminUserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminUserServiceImpl implements IAdminUserService {
    
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final RoleRepository roleRepository;
    
    public AdminUserServiceImpl(UserRepository userRepository, 
                                UserProfileRepository userProfileRepository,
                                RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.roleRepository = roleRepository;
    }
    
    @Override
    public Page<AdminUserResponse> getAllUsers(int page, int size, String keyword, UserStatus status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        Page<User> userPage;
        if (keyword != null && !keyword.trim().isEmpty()) {
            userPage = userRepository.searchByKeyword(keyword.trim(), pageable);
        } else if (status != null) {
            userPage = userRepository.findByStatus(status, pageable);
        } else {
            userPage = userRepository.findAllWithRoles(pageable);
        }
        
        // Get all user profiles for the users in this page
        Set<UUID> userIds = userPage.getContent().stream()
                .map(User::getId)
                .collect(Collectors.toSet());
        
        Map<UUID, UserProfile> profileMap = userProfileRepository.findByUserIdIn(userIds)
                .stream()
                .collect(Collectors.toMap(p -> p.getUser().getId(), p -> p));
        
        return userPage.map(user -> mapToAdminUserResponse(user, profileMap.get(user.getId())));
    }
    
    @Override
    public AdminUserResponse getUserById(UUID userId) {
        User user = userRepository.findByIdWithRoles(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);
        
        return mapToAdminUserResponse(user, profile);
    }
    
    @Override
    @Transactional
    public AdminUserResponse updateUserRoles(UUID userId, UpdateUserRolesRequest request) {
        User user = userRepository.findByIdWithRoles(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Clear existing roles
        user.getRoleUsers().clear();
        
        // Add new roles
        for (UserRole roleName : request.getRoles()) {
            Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));
            
            RoleUser roleUser = new RoleUser();
            roleUser.setUser(user);
            roleUser.setRole(role);
            roleUser.setCreatedAt(LocalDateTime.now());
            roleUser.setUpdatedAt(LocalDateTime.now());
            user.getRoleUsers().add(roleUser);
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);
        
        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);
        return mapToAdminUserResponse(savedUser, profile);
    }
    
    @Override
    @Transactional
    public AdminUserResponse updateUserStatus(UUID userId, UpdateUserStatusRequest request) {
        User user = userRepository.findByIdWithRoles(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setStatus(request.getStatus());
        user.setUpdatedAt(LocalDateTime.now());
        
        // If status is BANNED or INACTIVE, also disable the user
        if (request.getStatus() == UserStatus.BANNED || request.getStatus() == UserStatus.INACTIVE) {
            user.setEnabled(false);
        }
        
        User savedUser = userRepository.save(user);
        
        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);
        return mapToAdminUserResponse(savedUser, profile);
    }
    
    @Override
    @Transactional
    public AdminUserResponse toggleUserEnabled(UUID userId) {
        User user = userRepository.findByIdWithRoles(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setEnabled(!user.isEnabled());
        user.setUpdatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        
        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);
        return mapToAdminUserResponse(savedUser, profile);
    }
    
    @Override
    @Transactional
    public void deleteUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Soft delete
        user.setDeletedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }
    
    private AdminUserResponse mapToAdminUserResponse(User user, UserProfile profile) {
        List<String> roles = user.getRoleUsers().stream()
                .map(ru -> ru.getRole().getName().name())
                .collect(Collectors.toList());
        
        return AdminUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(profile != null ? profile.getDisplayName() : null)
                .avatarUrl(profile != null ? profile.getAvatarUrl() : null)
                .enabled(user.isEnabled())
                .status(user.getStatus())
                .roles(roles)
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
