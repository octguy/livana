package octguy.livanabe.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateExperienceBookingRequest {

    @NotNull(message = "Session ID is required")
    private UUID sessionId;

    @Min(value = 1, message = "At least 1 participant is required")
    private int quantity;
}
