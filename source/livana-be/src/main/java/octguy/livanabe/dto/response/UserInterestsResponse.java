package octguy.livanabe.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class UserInterestsResponse {

    private UUID userId;

    private String username;

    private List<InterestResponse> interests;
}
