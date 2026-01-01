package octguy.livanabe.service;

import octguy.livanabe.dto.request.CreateReviewRequest;
import octguy.livanabe.dto.response.ListingRatingSummary;
import octguy.livanabe.dto.response.ReviewResponse;

import java.util.List;
import java.util.UUID;

public interface IReviewService {
    
    ReviewResponse createReview(CreateReviewRequest request);
    
    ListingRatingSummary getListingReviews(UUID listingId);
    
    List<ReviewResponse> getReviewsByReviewer(UUID reviewerId);
    
    ReviewResponse updateReview(UUID reviewId, CreateReviewRequest request);
    
    void deleteReview(UUID reviewId);
    
    boolean hasUserReviewedListing(UUID listingId, UUID reviewerId);
}
