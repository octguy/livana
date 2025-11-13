package octguy.livanabe.service.implementation;

import octguy.livanabe.entity.AuthCredential;
import octguy.livanabe.entity.CustomUserDetails;
import octguy.livanabe.entity.User;
import octguy.livanabe.exception.UserNotFoundException;
import octguy.livanabe.repository.AuthCredentialRepository;
import octguy.livanabe.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final AuthCredentialRepository authCredentialRepository;

    public UserDetailsServiceImpl(UserRepository userRepository, AuthCredentialRepository authCredentialRepository) {
        this.authCredentialRepository = authCredentialRepository;
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByUsernameWithRolesAndInterests(username) // fetch roles eagerly
                .orElseThrow(() -> new UserNotFoundException("User with username " + username + " not found"));

        AuthCredential authCredential = authCredentialRepository.findByUser(user)
                .orElseThrow(() -> new UserNotFoundException("Credentials for user with username " + username + " not found"));
        return new CustomUserDetails(user, authCredential.getPassword());
    }
}