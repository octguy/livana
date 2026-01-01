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
public class ReviewResponse {
    
    private UUID id;
    private UUID listingId;
    private UUID reviewerId;
    private String reviewerName;
    private String reviewerAvatar;
    private Integer rating;
    private String comment;
    private String reviewType;
    private LocalDateTime createdAt;
}
