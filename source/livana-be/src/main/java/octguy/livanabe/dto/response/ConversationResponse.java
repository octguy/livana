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
public class ConversationResponse {
    
    private UUID id;
    private ParticipantInfo participant;
    private String lastMessageContent;
    private LocalDateTime lastMessageAt;
    private Integer unreadCount;
    private LocalDateTime createdAt;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParticipantInfo {
        private UUID id;
        private String displayName;
        private String avatarUrl;
    }
}
