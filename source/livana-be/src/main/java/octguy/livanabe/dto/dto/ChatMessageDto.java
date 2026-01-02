package octguy.livanabe.dto.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO for real-time chat message delivery via WebSocket
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {
    
    private UUID id;
    private UUID conversationId;
    private UUID senderId;
    private String senderName;
    private String senderAvatar;
    private UUID receiverId;
    private String messageType;
    private String content;
    private String fileUrl;
    private String fileName;
    private Long fileSize;
    private String fileType;
    private LocalDateTime createdAt;
}
