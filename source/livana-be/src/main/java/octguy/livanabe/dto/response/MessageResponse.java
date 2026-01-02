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
public class MessageResponse {
    
    private UUID id;
    private UUID conversationId;
    private UUID senderId;
    private String senderName;
    private String senderAvatar;
    private String messageType;
    private String content;
    private String fileUrl;
    private String fileName;
    private Long fileSize;
    private String fileType;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
