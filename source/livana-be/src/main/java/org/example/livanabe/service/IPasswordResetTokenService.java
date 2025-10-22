package org.example.livanabe.service;

import org.example.livanabe.model.PasswordResetToken;
import org.example.livanabe.model.User;

import java.util.UUID;

public interface IPasswordResetTokenService {

    PasswordResetToken findById(UUID id);

    PasswordResetToken create(User user);

    PasswordResetToken validateToken(String token);

    void markTokenAsUsed(PasswordResetToken token);
}
