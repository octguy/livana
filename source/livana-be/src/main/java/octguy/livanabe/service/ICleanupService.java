package octguy.livanabe.service;

public interface ICleanupService {

    void cleanupPendingUsers();

    void cleanupExpiredRefreshTokens();

    void cleanupExpiredPasswordResetTokens();
}
