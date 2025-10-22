package org.example.livanabe.service.implementation;

import jakarta.mail.MessagingException;
import org.example.livanabe.dto.request.*;
import org.example.livanabe.dto.response.AuthResponse;
import org.example.livanabe.enums.UserRole;
import org.example.livanabe.enums.UserStatus;
import org.example.livanabe.exception.*;
import org.example.livanabe.jwt.JwtUtil;
import org.example.livanabe.model.*;
import org.example.livanabe.repository.AuthCredentialRepository;
import org.example.livanabe.repository.RoleRepository;
import org.example.livanabe.repository.UserRepository;
import org.example.livanabe.service.IAuthService;
import org.example.livanabe.service.IEmailService;
import org.example.livanabe.service.IPasswordResetTokenService;
import org.example.livanabe.service.IRefreshTokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthServiceImpl implements IAuthService {

    @Value("${spring.verification-code.expiration}")
    private Long expiration;

    private final UserRepository userRepository;

    private final AuthCredentialRepository authCredentialRepository;

    private final RoleRepository roleRepository;

    private final IRefreshTokenService refreshTokenService;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    private final IEmailService emailService;

    private final AuthenticationManager authenticationManager;

    private final UserDetailsServiceImpl userDetailsService;

    private final IPasswordResetTokenService passwordResetTokenService;


    public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil, IEmailService emailService,
                           AuthenticationManager authenticationManager,
                           AuthCredentialRepository authCredentialRepository,
                           IRefreshTokenService refreshTokenService,
                           RoleRepository roleRepository,
                           UserDetailsServiceImpl userDetailsService,
                           IPasswordResetTokenService passwordResetTokenService) {
        this.passwordResetTokenService = passwordResetTokenService;
        this.userDetailsService = userDetailsService;
        this.roleRepository = roleRepository;
        this.refreshTokenService = refreshTokenService;
        this.authCredentialRepository = authCredentialRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEnabled()) {
            throw new EmailNotVerifiedException("User not verified. Please verify your email.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        user.setLastLoginAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String accessToken = jwtUtil.generateToken(userDetails);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        String token = refreshToken.getToken();

        return AuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .accessToken(accessToken)
                .refreshToken(token)
                .build();
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already in use");
        }

        // Create a new record of user
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setEnabled(false);
        user.setStatus(UserStatus.PENDING_VERIFICATION);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        Role role = roleRepository.findByName(UserRole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        // Assign role to user
        user.addRole(role); // role user will be added (cascade = CascadeType.ALL)
        userRepository.save(user);

        // Create a new record of auth credentials
        AuthCredential authCredential = new AuthCredential();
        authCredential.setId(UUID.randomUUID());
        authCredential.setUser(user);
        authCredential.setPassword(passwordEncoder.encode(request.getPassword()));
        String verificationCode = generateVerificationCode();
        authCredential.setVerificationCode(verificationCode);
        authCredential.setVerificationExpiration(LocalDateTime.now().plusMinutes(expiration));
        authCredential.setCreatedAt(LocalDateTime.now());
        authCredential.setUpdatedAt(LocalDateTime.now());
        authCredentialRepository.save(authCredential);

        sendVerificationEmail(user.getEmail(), verificationCode);

        return AuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .accessToken(null)
                .refreshToken(null)
                .build();
    }

    @Override
    @Transactional
    public void verifyUser(VerifyUserRequest request) {
        Optional<User> user = userRepository.findByEmail(request.getEmail());

        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }

        User userDetails = user.get();
        AuthCredential authCredential = authCredentialRepository.findByUser(userDetails)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (authCredential.getVerificationExpiration().isBefore(LocalDateTime.now())) {
            throw new InvalidVerificationCodeException("Verification code expired");
        }

        if (request.getVerificationCode().equals(authCredential.getVerificationCode())) {
            userDetails.setEnabled(true);
            userDetails.setStatus(UserStatus.ACTIVE);
            userDetails.setUpdatedAt(LocalDateTime.now());

            authCredential.setVerificationCode(null);
            authCredential.setVerificationExpiration(null);
            authCredential.setUpdatedAt(LocalDateTime.now());

            userRepository.save(userDetails);
            authCredentialRepository.save(authCredential);
        } else {
            throw new InvalidVerificationCodeException("Invalid verification code");
        }
    }

    @Override
    @Transactional
    public void resendVerificationCode(String email) {
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }

        User userDetails = user.get();
        if (userDetails.isEnabled()) {
            throw new BadRequestException("User already verified");
        } else {
            AuthCredential authCredential = authCredentialRepository.findByUser(userDetails)
                    .orElseThrow(() -> new UserNotFoundException("User not found"));
            authCredential.setVerificationCode(generateVerificationCode());
            authCredential.setVerificationExpiration(LocalDateTime.now().plusMinutes(expiration));
            authCredential.setUpdatedAt(LocalDateTime.now());
            authCredentialRepository.save(authCredential);
            sendVerificationEmail(userDetails.getEmail(), authCredential.getVerificationCode());
        }
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        RefreshToken refreshToken = refreshTokenService.findByToken(token);

        if (refreshTokenService.verifyExpiration(refreshToken)) {
            throw new UnauthorizedException("Refresh token expired. Please login again.");
            // Return 401 http, frontend should catch this and redirect to login
        }

        User user = refreshToken.getUser();
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String accessToken = jwtUtil.generateToken(userDetails);
        String newRefreshToken = refreshTokenService.createRefreshToken(user).getToken();

        return AuthResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .accessToken(accessToken)
                .refreshToken(newRefreshToken)
                .build();
    }

    @Override
    @Transactional
    public void requestPasswordReset(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new UserNotFoundException("User not found"));
        PasswordResetToken token = passwordResetTokenService.create(user);
        sendForgetPasswordEmail(user.getEmail(), token.getToken());
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenService.validateToken(request.getToken());

        User user = resetToken.getUser();
        AuthCredential authCredential = authCredentialRepository.findByUser(user)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        authCredential.setPassword(passwordEncoder.encode(request.getNewPassword()));
        authCredential.setUpdatedAt(LocalDateTime.now());
        authCredential.setLastPasswordChangeAt(LocalDateTime.now());
        authCredentialRepository.save(authCredential);

        passwordResetTokenService.markTokenAsUsed(resetToken);
    }

    @Override
    @Transactional
    public void logout() {
        User currentUser = getCurrentUser();
        System.out.println(currentUser.getEmail());
        refreshTokenService.deleteByUser(currentUser);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // the code above always return an object of type UsernamePasswordAuthenticationToken
        // if not authenticated, the object will be AnonymousAuthenticationToken (if not .authenticated() in SecurityConfig)

//        System.out.println(authentication.isAuthenticated()); // always true

//        System.out.println(authentication.getClass());
//        System.out.println(authentication.getPrincipal().toString());
//        System.out.println(authentication.getCredentials());

        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        return customUserDetails.getUser();
    }

    private void sendForgetPasswordEmail(String email, String token) {
        String subject = "Password Reset Request";
        String resetLink = "http://localhost:8080/api/v1/auth/reset-password?token=" + token; // Replace with your frontend URL
        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Password Reset Request</h2>"
                + "<p style=\"font-size: 16px;\">We received a request to reset your password. Click the link below to reset it:</p>"
                + "<a href=\"" + resetLink + "\" style=\"display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;\">Reset Password</a>"
                + "<p style=\"font-size: 14px; color: #777; margin-top: 20px;\">If you did not request a password reset, please ignore this email.</p>"
                + "</div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendEmail(email, subject, htmlMessage);
        } catch (MessagingException e) {
            // Handle email sending exception
            e.printStackTrace();
        }
    }

    private void sendVerificationEmail(String email, String code) {
        String subject = "Account Verification";
        String verificationCode = "VERIFICATION CODE " + code;
        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
                + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<h3 style=\"color: #333;\">Verification Code:</h3>"
                + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendEmail(email, subject, htmlMessage);
        } catch (MessagingException e) {
            // Handle email sending exception
            e.printStackTrace();
        }
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }
}