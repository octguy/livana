package octguy.livanabe.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import octguy.livanabe.dto.request.CreateReviewRequest;
import octguy.livanabe.dto.response.ListingRatingSummary;
import octguy.livanabe.dto.response.ReviewResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.IReviewService;
import octguy.livanabe.utils.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final IReviewService reviewService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @Valid @RequestBody CreateReviewRequest request
    ) {
        ReviewResponse review = reviewService.createReview(request);
        
        ApiResponse<ReviewResponse> response = new ApiResponse<>(
                HttpStatus.CREATED,
                "Review created successfully",
                review,
                null
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/listing/{listingId}")
    public ResponseEntity<ApiResponse<ListingRatingSummary>> getListingReviews(
            @PathVariable UUID listingId
    ) {
        ListingRatingSummary summary = reviewService.getListingReviews(listingId);
        
        ApiResponse<ListingRatingSummary> response = new ApiResponse<>(
                HttpStatus.OK,
                "Reviews retrieved successfully",
                summary,
                null
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getMyReviews() {
        UUID reviewerId = SecurityUtils.getCurrentUser().getId();
        List<ReviewResponse> reviews = reviewService.getReviewsByReviewer(reviewerId);
        
        ApiResponse<List<ReviewResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Reviews retrieved successfully",
                reviews,
                null
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check/{listingId}")
    public ResponseEntity<ApiResponse<Boolean>> hasUserReviewedListing(
            @PathVariable UUID listingId
    ) {
        UUID reviewerId = SecurityUtils.getCurrentUser().getId();
        boolean hasReviewed = reviewService.hasUserReviewedListing(listingId, reviewerId);
        
        ApiResponse<Boolean> response = new ApiResponse<>(
                HttpStatus.OK,
                "Check completed",
                hasReviewed,
                null
        );
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReview(
            @PathVariable UUID reviewId,
            @Valid @RequestBody CreateReviewRequest request
    ) {
        ReviewResponse review = reviewService.updateReview(reviewId, request);
        
        ApiResponse<ReviewResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Review updated successfully",
                review,
                null
        );
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @PathVariable UUID reviewId
    ) {
        reviewService.deleteReview(reviewId);
        
        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.OK,
                "Review deleted successfully",
                null,
                null
        );
        
        return ResponseEntity.ok(response);
    }
}
