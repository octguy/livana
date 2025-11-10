package octguy.livanabe.service.implementation;

import octguy.livanabe.entity.UserProfile;
import octguy.livanabe.repository.UserProfileRepository;
import octguy.livanabe.service.IUserProfileService;
import org.springframework.stereotype.Service;

@Service
public class UserProfileServiceImpl implements IUserProfileService {

    private final UserProfileRepository userProfileRepository;

    public UserProfileServiceImpl(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    @Override
    public void create(UserProfile userProfile) {
        userProfileRepository.save(userProfile);
    }
}
