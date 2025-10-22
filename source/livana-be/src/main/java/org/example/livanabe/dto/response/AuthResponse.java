package org.example.livanabe.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AuthResponse {
    private UUID id;
    private String username;
    private String email;
    private String accessToken;
    private String refreshToken;
}
