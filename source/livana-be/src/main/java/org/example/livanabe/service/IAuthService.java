package org.example.livanabe.service;

import org.example.livanabe.dto.request.*;
import org.example.livanabe.dto.response.AuthResponse;

public interface IAuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);

    void verifyUser(VerifyUserRequest request);

    void resendVerificationCode(String email);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void requestPasswordReset(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    void logout();
}

