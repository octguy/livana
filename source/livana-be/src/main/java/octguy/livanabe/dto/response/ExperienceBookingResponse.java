package octguy.livanabe.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
public class ExperienceBookingResponse extends BookingResponse {
    private UUID sessionId;
    private UUID experienceListingId;
    private String experienceListingTitle;
    private LocalDateTime sessionStartTime;
    private LocalDateTime sessionEndTime;
    private int quantity;
}
