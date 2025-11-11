package octguy.livanabe.service.implementation;

import octguy.livanabe.dto.response.UserProfileResponse;
import octguy.livanabe.entity.User;
import octguy.livanabe.entity.UserProfile;
import octguy.livanabe.repository.UserProfileRepository;
import octguy.livanabe.service.IUserProfileService;
import octguy.livanabe.utils.SecurityUtils;
import org.springframework.stereotype.Service;

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
    public UserProfile update(UUID id, UserProfile userProfile) {
        Optional<UserProfile> existing = userProfileRepository.findById(id);
        if (existing.isEmpty()) {
            return null;
        }
        UserProfile current = existing.get();
        // update allowed fields; leave id and user relation unless provided
        current.setDisplayName(userProfile.getDisplayName());
        current.setPhoneNumber(userProfile.getPhoneNumber());
        current.setBio(userProfile.getBio());
        current.setAvatarUrl(userProfile.getAvatarUrl());
        current.setUpdatedAt(LocalDateTime.now());

        return userProfileRepository.save(current);
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
