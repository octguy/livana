package octguy.livanabe.repository;

import octguy.livanabe.entity.ExperienceListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ExperienceListingRepository extends JpaRepository<ExperienceListing, UUID> {
    
    List<ExperienceListing> findByHostId(UUID hostId);
    
    // Dashboard statistics queries
    @Query("SELECT COUNT(e) FROM ExperienceListing e WHERE e.deletedAt IS NULL")
    Long countAllActiveExperienceListings();
    
    @Query("SELECT COUNT(e) FROM ExperienceListing e WHERE e.createdAt >= :startDate AND e.deletedAt IS NULL")
    Long countExperienceListingsCreatedAfter(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(e) FROM ExperienceListing e WHERE e.createdAt >= :startDate AND e.createdAt < :endDate AND e.deletedAt IS NULL")
    Long countExperienceListingsCreatedBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
