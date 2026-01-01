package octguy.livanabe.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateReviewRequest {
    
    @NotNull(message = "Listing ID is required")
    private UUID listingId;
    
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;
    
    @Size(max = 1000, message = "Comment must be at most 1000 characters")
    private String comment;
    
    @NotNull(message = "Review type is required")
    private String reviewType; // HOME_LISTING or EXPERIENCE_LISTING
}
