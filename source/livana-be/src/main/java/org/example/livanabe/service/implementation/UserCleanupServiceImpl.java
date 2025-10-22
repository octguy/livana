package org.example.livanabe.service.implementation;

import org.example.livanabe.model.AuthCredential;
import org.example.livanabe.model.User;
import org.example.livanabe.repository.AuthCredentialRepository;
import org.example.livanabe.repository.UserRepository;
import org.example.livanabe.service.IUserCleanupService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserCleanupServiceImpl implements IUserCleanupService {

    private final UserRepository userRepository;

    private final AuthCredentialRepository authCredentialRepository;

    public UserCleanupServiceImpl(UserRepository userRepository, AuthCredentialRepository authCredentialRepository) {
        this.authCredentialRepository = authCredentialRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    @Scheduled(fixedRate = 60000) // runs every 1 minute
    public void cleanupPendingUsers() {
        LocalDateTime now = LocalDateTime.now();
        List<User> users = userRepository.findPendingUserExceedOneDay();

        if (users.isEmpty()) {
            System.out.println("🧹 No unverified users to clean up.");
            return;
        }

        List<AuthCredential> authCredentials = authCredentialRepository.findAllByUserIn(users);

        // Soft delete by setting deletedAt timestamp
        users.forEach(user -> user.setDeletedAt(now));
        authCredentials.forEach(credential -> credential.setDeletedAt(now));

        userRepository.saveAll(users);
        authCredentialRepository.saveAll(authCredentials);

        System.out.println("🧹 Cleaned up " + users.size() + " unverified users and their credentials.");
    }
}
