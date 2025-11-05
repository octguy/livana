package octguy.livanabe.service;

import octguy.livanabe.entity.PasswordResetToken;
import octguy.livanabe.entity.User;

import java.util.UUID;

public interface IPasswordResetTokenService {

    PasswordResetToken findById(UUID id);

    PasswordResetToken create(User user);

    PasswordResetToken validateToken(String token);

    void markTokenAsUsed(PasswordResetToken token);
}
