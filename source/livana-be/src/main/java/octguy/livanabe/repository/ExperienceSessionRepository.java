package octguy.livanabe.repository;

import octguy.livanabe.entity.ExperienceSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface ExperienceSessionRepository extends JpaRepository<ExperienceSession, UUID> {
    
    List<ExperienceSession> findByExperienceListingIdOrderByStartTimeAsc(UUID experienceListingId);
    
    @Query("SELECT s FROM ExperienceSession s WHERE s.experienceListing.id IN :listingIds ORDER BY s.startTime ASC")
    List<ExperienceSession> findByExperienceListingIdIn(@Param("listingIds") Set<UUID> listingIds);
    
    @Modifying
    @Query("DELETE FROM ExperienceSession s WHERE s.experienceListing.id = :listingId")
    void deleteByExperienceListingId(@Param("listingId") UUID listingId);
}
