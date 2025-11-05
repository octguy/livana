package octguy.livanabe.service.implementation;

import octguy.livanabe.entity.AuthCredential;
import octguy.livanabe.entity.PasswordResetToken;
import octguy.livanabe.entity.RefreshToken;
import octguy.livanabe.entity.User;
import octguy.livanabe.repository.AuthCredentialRepository;
import octguy.livanabe.repository.PasswordResetTokenRepository;
import octguy.livanabe.repository.RefreshTokenRepository;
import octguy.livanabe.repository.UserRepository;
import octguy.livanabe.service.ICleanupService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CleanupServiceImpl implements ICleanupService {

    private final UserRepository userRepository;

    private final AuthCredentialRepository authCredentialRepository;

    private final RefreshTokenRepository refreshTokenRepository;

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public CleanupServiceImpl(UserRepository userRepository,
                              AuthCredentialRepository authCredentialRepository,
                              RefreshTokenRepository refreshTokenRepository,
                              PasswordResetTokenRepository passwordResetTokenRepository) {
        this.authCredentialRepository = authCredentialRepository;
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    @Override
    @Transactional
    @Scheduled(cron = "0 0 0 * * *") // runs every 1 day at midnight
    public void cleanupPendingUsers() {
        LocalDateTime now = LocalDateTime.now();
        List<User> users = userRepository.findPendingUserExceedOneDay();

        if (users.isEmpty()) {
            System.out.println("No unverified users to clean up.");
        } else {
            List<AuthCredential> authCredentials = authCredentialRepository.findAllByUserIn(users);

            // Soft delete by setting deletedAt timestamp
            users.forEach(user -> user.setDeletedAt(now));
            authCredentials.forEach(credential -> credential.setDeletedAt(now));

            userRepository.saveAll(users);
            authCredentialRepository.saveAll(authCredentials);

            System.out.println("Cleaned up " + users.size() + " unverified users and their credentials.");
        }
    }

    @Override
    @Transactional
    @Scheduled(cron = "0 0 0 * * *") // runs every 1 day at midnight
    public void cleanupExpiredRefreshTokens() {
        List<RefreshToken> expiredTokens = refreshTokenRepository.findAllTokenExpiredAfter24Hours();

        if (expiredTokens.isEmpty()) {
            System.out.println("No expired refresh tokens to clean up.");
        } else {
            refreshTokenRepository.deleteAll(expiredTokens);
            System.out.println("Cleaned up " + expiredTokens.size() + " expired refresh tokens.");
        }
    }

    @Override
    @Transactional
    @Scheduled(cron = "0 0 0 * * *") // runs every 1 day at midnight
    public void cleanupExpiredPasswordResetTokens() {
        List<PasswordResetToken> expiredTokens = passwordResetTokenRepository.findAllTokenExpiredAfter24Hours();

        if (expiredTokens.isEmpty()) {
            System.out.println("No expired password reset tokens to clean up.");
        } else {
            passwordResetTokenRepository.deleteAll(expiredTokens);
            System.out.println("Cleaned up " + expiredTokens.size() + " expired password reset tokens.");
        }
    }
}