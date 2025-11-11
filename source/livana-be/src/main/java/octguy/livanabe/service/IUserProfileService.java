package octguy.livanabe.service;

import octguy.livanabe.dto.response.UserProfileResponse;
import octguy.livanabe.entity.UserProfile;

import java.util.List;
import java.util.UUID;

public interface IUserProfileService {

    UserProfileResponse getMe();

    UserProfile create(UserProfile userProfile);

    List<UserProfile> findAll();

    UserProfile findById(UUID id);

    UserProfile update(UUID id, UserProfile userProfile);

    void delete(UUID id);
}
