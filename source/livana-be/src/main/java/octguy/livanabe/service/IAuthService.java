package octguy.livanabe.service;

import octguy.livanabe.dto.request.*;
import octguy.livanabe.dto.response.AuthResponse;

public interface IAuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);

    AuthResponse createAdmin(RegisterRequest request);

    void verifyUser(VerifyUserRequest request);

    void resendVerificationCode(String email);

    AuthResponse refreshToken(String token);

    void requestPasswordReset(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    void changePassword(ChangePasswordRequest request);

    void logout(String token);
}

