package octguy.livanabe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationMessage {
    
    private UUID id;
    private UUID recipientId;
    private String type; // BOOKING_HOME, BOOKING_EXPERIENCE
    private String title;
    private String message;
    private Object data; // Booking details
    private boolean read;
    private LocalDateTime createdAt;
}
