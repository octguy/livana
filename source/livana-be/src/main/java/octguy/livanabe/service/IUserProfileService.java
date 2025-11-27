package octguy.livanabe.service;

import octguy.livanabe.dto.request.UpdateUserProfileRequest;
import octguy.livanabe.dto.response.UserProfileResponse;
import octguy.livanabe.entity.UserProfile;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface IUserProfileService {

    UserProfileResponse getMe();

    UserProfile create(UserProfile userProfile);

    List<UserProfile> findAll();

    UserProfile findById(UUID id);

    UserProfileResponse update(UUID id, UpdateUserProfileRequest updateUserProfileRequest);

    UserProfileResponse uploadAvatar(MultipartFile file);

    void deleteAvatar();

    void delete(UUID id);
}
