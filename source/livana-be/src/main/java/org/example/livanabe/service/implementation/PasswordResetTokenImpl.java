package org.example.livanabe.service.implementation;

import org.example.livanabe.exception.BadRequestException;
import org.example.livanabe.model.PasswordResetToken;
import org.example.livanabe.model.User;
import org.example.livanabe.repository.PasswordResetTokenRepository;
import org.example.livanabe.service.IPasswordResetTokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetTokenImpl implements IPasswordResetTokenService {

    @Value("${spring.reset-password-token.expiration}")
    private Long expiration;

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public PasswordResetTokenImpl(PasswordResetTokenRepository passwordResetTokenRepository) {
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    @Override
    public PasswordResetToken findById(UUID id) {
        return passwordResetTokenRepository.findById(id).orElseThrow(() -> new RuntimeException("Password reset token not found"));
    }

    @Override
    public PasswordResetToken create(User user) { // reset or create new
        if (passwordResetTokenRepository.findByUser(user).isPresent()) {
            PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByUser(user).get();
            passwordResetToken.setToken(UUID.randomUUID().toString());
            passwordResetToken.setExpiration(LocalDateTime.now().plusMinutes(expiration));
            passwordResetToken.setUpdatedAt(LocalDateTime.now());
            return passwordResetTokenRepository.save(passwordResetToken);
        } else {
            PasswordResetToken passwordResetToken = new PasswordResetToken();
            passwordResetToken.setId(UUID.randomUUID());
            passwordResetToken.setUser(user);
            passwordResetToken.setToken(UUID.randomUUID().toString());
            passwordResetToken.setExpiration(LocalDateTime.now().plusMinutes(expiration));
            passwordResetToken.setCreatedAt(LocalDateTime.now());
            passwordResetToken.setUpdatedAt(LocalDateTime.now());
            return passwordResetTokenRepository.save(passwordResetToken);
        }
    }

    @Override
    public PasswordResetToken validateToken(String token) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid token"));

        if (resetToken.getExpiration().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Token expired");
        }

        return resetToken;
    }

    @Override
    public void markTokenAsUsed(PasswordResetToken token) {
        passwordResetTokenRepository.delete(token);
    }
}
