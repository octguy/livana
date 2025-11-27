package octguy.livanabe.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class UserProfileResponse {

    private UUID id;

    private String username;

    private String email;

    private String fullName;

    private String phoneNumber;

    private String bio;

    private String avatarUrl;

    private String avatarPublicId;
}
