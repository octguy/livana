package octguy.livanabe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import octguy.livanabe.enums.NotificationType;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    
    private UUID id;
    private UUID recipientId;
    private NotificationType type;
    private String title;
    private String message;
    private UUID referenceId;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
