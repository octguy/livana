package octguy.livanabe.service.implementation;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import octguy.livanabe.dto.request.UpdateUserProfileRequest;
import octguy.livanabe.dto.response.CloudinaryResponse;
import octguy.livanabe.dto.response.UserProfileResponse;
import octguy.livanabe.entity.User;
import octguy.livanabe.entity.UserProfile;
import octguy.livanabe.exception.UserNotFoundException;
import octguy.livanabe.repository.UserProfileRepository;
import octguy.livanabe.service.ICloudinaryService;
import octguy.livanabe.service.IUserProfileService;
import octguy.livanabe.utils.SecurityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserProfileServiceImpl implements IUserProfileService {

    private final UserProfileRepository userProfileRepository;

    private final ICloudinaryService cloudinaryService;

    public UserProfileServiceImpl(UserProfileRepository userProfileRepository,
                                  ICloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
        this.userProfileRepository = userProfileRepository;
    }

    @Override
    public UserProfileResponse getMe() {
        User currentUser = SecurityUtils.getCurrentUser();
        Optional<UserProfile> opt = userProfileRepository.findByUserId(currentUser.getId());

        if (opt.isEmpty()) {
            return null;
        }

        UserProfile userProfile = opt.get();

        List<String> roles = currentUser.getRoleUsers().stream()
                .map(roleUser -> String.valueOf(roleUser.getRole().getName()))
                .toList();

        return UserProfileResponse.builder()
                .id(currentUser.getId())
                .username(currentUser.getUsername())
                .email(currentUser.getEmail())
                .bio(userProfile.getBio())
                .phoneNumber(userProfile.getPhoneNumber())
                .avatarUrl(userProfile.getAvatarUrl())
                .fullName(userProfile.getDisplayName())
                .roles(roles)
                .build();
    }

    @Override
    public UserProfile create(UserProfile userProfile) {
        return userProfileRepository.save(userProfile);
    }

    @Override
    public List<UserProfile> findAll() {
        return userProfileRepository.findAll();
    }

    @Override
    public UserProfile findById(UUID id) {
        Optional<UserProfile> opt = userProfileRepository.findById(id);
        return opt.orElse(null);
    }

    @Override
    @Transactional
    public UserProfileResponse update(UpdateUserProfileRequest updatedProfile) {
        User currentUser = SecurityUtils.getCurrentUser();
        UUID id = currentUser.getId();

        Optional<UserProfile> existing = userProfileRepository.findByUserId(id);
        if (existing.isEmpty()) {
            throw new UserNotFoundException("User not found when updating profile with user id: " + id);
        }
        UserProfile current = existing.get();

        if (updatedProfile.getFullName() != null) {
            current.setDisplayName(updatedProfile.getFullName());
        }

        if (updatedProfile.getPhoneNumber() != null) {
            current.setPhoneNumber(updatedProfile.getPhoneNumber());
        }

        if (updatedProfile.getBio() != null) {
            current.setBio(updatedProfile.getBio());
        }

        current.setUpdatedAt(LocalDateTime.now());
        userProfileRepository.save(current);

        List<String> roles = currentUser.getRoleUsers().stream()
                .map(roleUser -> String.valueOf(roleUser.getRole().getName()))
                .toList();

        return UserProfileResponse.builder()
                .id(id)
                .username(current.getUser().getUsername())
                .email(current.getUser().getEmail())
                .fullName(current.getDisplayName())
                .phoneNumber(current.getPhoneNumber())
                .bio(current.getBio())
                .avatarUrl(current.getAvatarUrl())
                .avatarPublicId(current.getAvatarPublicId())
                .roles(roles)
                .build();
    }

    @Override
    @Transactional
    public UserProfileResponse uploadAvatar(MultipartFile file) {
        User currentUser = SecurityUtils.getCurrentUser();
        Optional<UserProfile> existing = userProfileRepository.findByUserId(currentUser.getId());
        if (existing.isEmpty()) {
            throw new UserNotFoundException("User not found when updating profile with user id: " + currentUser.getId());
        }
        UserProfile current = existing.get();

        // Delete existing avatar on cloudinary if exists
        if (current.getAvatarPublicId() != null && current.getAvatarUrl() != null) {
            deleteAvatar();
        }

        // Upload to cloudinary
        CloudinaryResponse uploadResponse = cloudinaryService.uploadImage(file);

        // Update in database
        current.setAvatarUrl(uploadResponse.getUrl());
        current.setAvatarPublicId(uploadResponse.getPublicId());
        current.setUpdatedAt(LocalDateTime.now());
        userProfileRepository.save(current);

        List<String> roles = currentUser.getRoleUsers().stream()
                .map(roleUser -> String.valueOf(roleUser.getRole().getName()))
                .toList();

        return UserProfileResponse.builder()
                .id(currentUser.getId())
                .username(currentUser.getUsername())
                .email(currentUser.getEmail())
                .fullName(current.getDisplayName())
                .phoneNumber(current.getPhoneNumber())
                .bio(current.getBio())
                .avatarUrl(current.getAvatarUrl())
                .avatarPublicId(current.getAvatarPublicId())
                .roles(roles)
                .build();
    }

    @Override
    @Transactional
    public void deleteAvatar() {
        User currentUser = SecurityUtils.getCurrentUser();
        UUID id = currentUser.getId();
        Optional<UserProfile> existing = userProfileRepository.findByUserId(id);
        if (existing.isEmpty()) {
            throw new UserNotFoundException("User not found when updating profile with user id: " + id);
        }
        UserProfile current = existing.get();

        // Delete on cloudinary
        cloudinaryService.deleteImage(current.getAvatarPublicId());

        // Delete in database
        current.setAvatarUrl(null);
        current.setAvatarPublicId(null);
        current.setUpdatedAt(LocalDateTime.now());
        userProfileRepository.save(current);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        Optional<UserProfile> existing = userProfileRepository.findById(id);
        if (existing.isPresent()) {
            UserProfile current = existing.get();
            current.setDeletedAt(LocalDateTime.now());
            userProfileRepository.save(current);
        }
    }
}
