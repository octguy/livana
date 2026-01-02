package octguy.livanabe.repository;

import octguy.livanabe.entity.HomeListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface HomeListingRepository extends JpaRepository<HomeListing, UUID> {
    List<HomeListing> findByHostId(UUID hostId);
    
    // Dashboard statistics queries
    @Query("SELECT COUNT(h) FROM HomeListing h WHERE h.deletedAt IS NULL")
    Long countAllActiveHomeListings();
    
    @Query("SELECT COUNT(h) FROM HomeListing h WHERE h.createdAt >= :startDate AND h.deletedAt IS NULL")
    Long countHomeListingsCreatedAfter(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(h) FROM HomeListing h WHERE h.createdAt >= :startDate AND h.createdAt < :endDate AND h.deletedAt IS NULL")
    Long countHomeListingsCreatedBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
