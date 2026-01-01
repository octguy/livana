package octguy.livanabe.service.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import octguy.livanabe.dto.request.CreateReviewRequest;
import octguy.livanabe.dto.response.ListingRatingSummary;
import octguy.livanabe.dto.response.NotificationMessage;
import octguy.livanabe.dto.response.ReviewResponse;
import octguy.livanabe.entity.BaseListing;
import octguy.livanabe.entity.Review;
import octguy.livanabe.entity.User;
import octguy.livanabe.entity.UserProfile;
import octguy.livanabe.enums.NotificationType;
import octguy.livanabe.enums.ReviewType;
import octguy.livanabe.exception.BadRequestException;
import octguy.livanabe.exception.ResourceNotFoundException;
import octguy.livanabe.repository.BaseListingRepository;
import octguy.livanabe.repository.ReviewRepository;
import octguy.livanabe.repository.UserProfileRepository;
import octguy.livanabe.repository.UserRepository;
import octguy.livanabe.service.INotificationService;
import octguy.livanabe.service.IReviewService;
import octguy.livanabe.utils.SecurityUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewServiceImpl implements IReviewService {

    private final ReviewRepository reviewRepository;
    private final BaseListingRepository baseListingRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final INotificationService notificationService;

    @Override
    @Transactional
    public ReviewResponse createReview(CreateReviewRequest request) {
        UUID reviewerId = SecurityUtils.getCurrentUser().getId();
        
        // Check if user has already reviewed this listing
        if (reviewRepository.existsByListingIdAndReviewerId(request.getListingId(), reviewerId)) {
            throw new BadRequestException("You have already reviewed this listing");
        }
        
        BaseListing listing = baseListingRepository.findById(request.getListingId())
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found"));
        
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // User cannot review their own listing
        if (listing.getHost().getId().equals(reviewerId)) {
            throw new BadRequestException("You cannot review your own listing");
        }
        
        Review review = Review.builder()
                .listing(listing)
                .reviewer(reviewer)
                .rating(request.getRating())
                .comment(request.getComment())
                .reviewType(ReviewType.valueOf(request.getReviewType()))
                .build();
        
        Review savedReview = reviewRepository.save(review);
        
        // Send notification to host
        sendReviewNotificationToHost(listing, reviewer, savedReview);
        
        return convertToResponse(savedReview);
    }

    @Override
    public ListingRatingSummary getListingReviews(UUID listingId) {
        List<Review> reviews = reviewRepository.findByListingIdOrderByCreatedAtDesc(listingId);
        Double averageRating = reviewRepository.getAverageRatingByListingId(listingId);
        Long totalReviews = reviewRepository.countByListingId(listingId);
        
        return ListingRatingSummary.builder()
                .averageRating(averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : 0.0)
                .totalReviews(totalReviews != null ? totalReviews : 0L)
                .reviews(reviews.stream().map(this::convertToResponse).collect(Collectors.toList()))
                .build();
    }

    @Override
    public List<ReviewResponse> getReviewsByReviewer(UUID reviewerId) {
        return reviewRepository.findByReviewerIdOrderByCreatedAtDesc(reviewerId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ReviewResponse updateReview(UUID reviewId, CreateReviewRequest request) {
        UUID currentUserId = SecurityUtils.getCurrentUser().getId();
        
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        
        if (!review.getReviewer().getId().equals(currentUserId)) {
            throw new BadRequestException("You can only update your own review");
        }
        
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        
        Review savedReview = reviewRepository.save(review);
        return convertToResponse(savedReview);
    }

    @Override
    @Transactional
    public void deleteReview(UUID reviewId) {
        UUID currentUserId = SecurityUtils.getCurrentUser().getId();
        
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        
        if (!review.getReviewer().getId().equals(currentUserId)) {
            throw new BadRequestException("You can only delete your own review");
        }
        
        reviewRepository.delete(review);
    }

    @Override
    public boolean hasUserReviewedListing(UUID listingId, UUID reviewerId) {
        return reviewRepository.existsByListingIdAndReviewerId(listingId, reviewerId);
    }

    private void sendReviewNotificationToHost(BaseListing listing, User reviewer, Review review) {
        UserProfile reviewerProfile = userProfileRepository.findByUserId(reviewer.getId()).orElse(null);
        String reviewerName = reviewerProfile != null ? 
                reviewerProfile.getDisplayName() : 
                reviewer.getEmail();
        
        NotificationMessage notification = NotificationMessage.builder()
                .recipientId(listing.getHost().getId())
                .type(NotificationType.NEW_REVIEW.name())
                .title("Đánh giá mới")
                .message(String.format("%s đã đánh giá %d sao cho tin đăng \"%s\" của bạn", 
                        reviewerName, review.getRating(), listing.getTitle()))
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();
        
        notificationService.sendBookingNotificationToHost(listing.getHost().getId(), notification);
    }

    private ReviewResponse convertToResponse(Review review) {
        UserProfile reviewerProfile = userProfileRepository.findByUserId(review.getReviewer().getId()).orElse(null);
        
        return ReviewResponse.builder()
                .id(review.getId())
                .listingId(review.getListing().getId())
                .reviewerId(review.getReviewer().getId())
                .reviewerName(reviewerProfile != null ? 
                        reviewerProfile.getDisplayName() : 
                        "Anonymous")
                .reviewerAvatar(reviewerProfile != null ? reviewerProfile.getAvatarUrl() : null)
                .rating(review.getRating())
                .comment(review.getComment())
                .reviewType(review.getReviewType().name())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
