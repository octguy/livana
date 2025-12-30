package octguy.livanabe.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class BulkCreateSessionResponse {

    private UUID experienceId;

    private int totalCreated;

    private List<SessionResponse> sessions;
}
