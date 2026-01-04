package octguy.livanabe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import octguy.livanabe.enums.UserStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {
    private UUID id;
    private String username;
    private String email;
    private String fullName;
    private String avatarUrl;
    private boolean enabled;
    private UserStatus status;
    private List<String> roles;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;
}
