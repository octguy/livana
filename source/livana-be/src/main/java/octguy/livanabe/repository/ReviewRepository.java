package octguy.livanabe.repository;

import octguy.livanabe.entity.Review;
import octguy.livanabe.enums.ReviewType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    
    List<Review> findByListingIdOrderByCreatedAtDesc(UUID listingId);
    
    List<Review> findByReviewerIdOrderByCreatedAtDesc(UUID reviewerId);
    
    Optional<Review> findByListingIdAndReviewerId(UUID listingId, UUID reviewerId);
    
    boolean existsByListingIdAndReviewerId(UUID listingId, UUID reviewerId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.listing.id = :listingId")
    Double getAverageRatingByListingId(@Param("listingId") UUID listingId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.listing.id = :listingId")
    Long countByListingId(@Param("listingId") UUID listingId);
    
    List<Review> findByListingIdAndReviewTypeOrderByCreatedAtDesc(UUID listingId, ReviewType reviewType);
}
