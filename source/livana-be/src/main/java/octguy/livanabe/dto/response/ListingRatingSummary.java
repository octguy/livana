package octguy.livanabe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListingRatingSummary {
    
    private Double averageRating;
    private Long totalReviews;
    private List<ReviewResponse> reviews;
}
