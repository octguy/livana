package octguy.livanabe.repository;

import octguy.livanabe.entity.ExperienceBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExperienceBookingRepository extends JpaRepository<ExperienceBooking, UUID> {
    
    List<ExperienceBooking> findByCustomerId(UUID customerId);
    
    List<ExperienceBooking> findBySessionId(UUID sessionId);
    
    @Query("SELECT eb FROM ExperienceBooking eb WHERE eb.session.experienceListing.id = :experienceListingId ORDER BY eb.createdAt DESC")
    List<ExperienceBooking> findByExperienceListingId(@Param("experienceListingId") UUID experienceListingId);
    
    @Query("SELECT eb FROM ExperienceBooking eb WHERE eb.session.experienceListing.host.id = :hostId ORDER BY eb.createdAt DESC")
    List<ExperienceBooking> findByHostId(@Param("hostId") UUID hostId);
    
    @Query("SELECT COALESCE(SUM(eb.quantity), 0) FROM ExperienceBooking eb " +
           "WHERE eb.session.id = :sessionId AND eb.status != 'CANCELLED'")
    int countBookedParticipants(@Param("sessionId") UUID sessionId);
}
