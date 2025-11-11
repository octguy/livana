package octguy.livanabe.service.implementation;

import octguy.livanabe.dto.request.UpdateUserProfileRequest;
import octguy.livanabe.dto.response.UserProfileResponse;
import octguy.livanabe.entity.User;
import octguy.livanabe.entity.UserProfile;
import octguy.livanabe.exception.UserNotFoundException;
import octguy.livanabe.repository.UserProfileRepository;
import octguy.livanabe.service.IUserProfileService;
import octguy.livanabe.utils.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserProfileServiceImpl implements IUserProfileService {

    private final UserProfileRepository userProfileRepository;

    public UserProfileServiceImpl(UserProfileRepository userProfileRepository) {
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

        return UserProfileResponse.builder()
                .id(currentUser.getId())
                .username(currentUser.getUsername())
                .email(currentUser.getEmail())
                .bio(userProfile.getBio())
                .phoneNumber(userProfile.getPhoneNumber())
                .avatarUrl(userProfile.getAvatarUrl())
                .fullName(userProfile.getDisplayName())
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
    public UserProfileResponse update(UUID id, UpdateUserProfileRequest updatedProfile) {
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

        if (updatedProfile.getAvatarUrl() != null) {
            current.setAvatarUrl(updatedProfile.getAvatarUrl());
        }

        current.setUpdatedAt(LocalDateTime.now());
        userProfileRepository.save(current);

        return UserProfileResponse.builder()
                .id(id)
                .username(current.getUser().getUsername())
                .email(current.getUser().getEmail())
                .fullName(current.getDisplayName())
                .phoneNumber(current.getPhoneNumber())
                .bio(current.getBio())
                .avatarUrl(current.getAvatarUrl())
                .build();
    }

    @Override
    public void delete(UUID id) {
        Optional<UserProfile> existing = userProfileRepository.findById(id);
        if (existing.isPresent()) {
            UserProfile current = existing.get();
            current.setDeletedAt(LocalDateTime.now());
            userProfileRepository.save(current);
        }
    }
}
