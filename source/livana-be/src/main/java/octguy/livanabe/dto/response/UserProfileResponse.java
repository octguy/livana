package octguy.livanabe.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileResponse {

    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String bio;
    private String avatarUrl;
}
