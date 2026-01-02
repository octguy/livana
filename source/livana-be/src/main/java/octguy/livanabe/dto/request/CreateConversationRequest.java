package octguy.livanabe.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateConversationRequest {
    
    @NotNull(message = "Participant ID is required")
    private UUID participantId;
}
