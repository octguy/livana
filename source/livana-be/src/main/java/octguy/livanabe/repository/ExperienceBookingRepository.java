package octguy.livanabe.repository;

import octguy.livanabe.entity.ExperienceBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ExperienceBookingRepository extends JpaRepository<ExperienceBooking, UUID> {
    
    List<ExperienceBooking> findByCustomerId(UUID customerId);
    
    List<ExperienceBooking> findBySessionId(UUID sessionId);
    
    @Query("SELECT eb FROM ExperienceBooking eb WHERE eb.session.experienceListing.id = :experienceListingId ORDER BY eb.createdAt DESC")
    List<ExperienceBooking> findByExperienceListingId(@Param("experienceListingId") UUID experienceListingId);
    
    @Modifying
    @Query("DELETE FROM ExperienceBooking eb WHERE eb.session.experienceListing.id = :experienceListingId")
    void deleteByExperienceListingId(@Param("experienceListingId") UUID experienceListingId);
    
    @Query("SELECT eb FROM ExperienceBooking eb WHERE eb.session.experienceListing.host.id = :hostId ORDER BY eb.createdAt DESC")
    List<ExperienceBooking> findByHostId(@Param("hostId") UUID hostId);
    
    @Query("SELECT COALESCE(SUM(eb.quantity), 0) FROM ExperienceBooking eb " +
           "WHERE eb.session.id = :sessionId AND eb.status != 'CANCELLED'")
    int countBookedParticipants(@Param("sessionId") UUID sessionId);
    
    // Dashboard statistics queries
    @Query("SELECT COUNT(eb) FROM ExperienceBooking eb WHERE eb.deletedAt IS NULL")
    Long countAllActiveExperienceBookings();
    
    @Query("SELECT COUNT(eb) FROM ExperienceBooking eb WHERE eb.createdAt >= :startDate AND eb.deletedAt IS NULL")
    Long countExperienceBookingsCreatedAfter(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(eb) FROM ExperienceBooking eb WHERE eb.createdAt >= :startDate AND eb.createdAt < :endDate AND eb.deletedAt IS NULL")
    Long countExperienceBookingsCreatedBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COALESCE(SUM(eb.totalPrice), 0) FROM ExperienceBooking eb WHERE eb.status = 'CONFIRMED' AND eb.deletedAt IS NULL")
    BigDecimal sumAllExperienceRevenue();
    
    @Query("SELECT COALESCE(SUM(eb.totalPrice), 0) FROM ExperienceBooking eb WHERE eb.status = 'CONFIRMED' AND eb.createdAt >= :startDate AND eb.deletedAt IS NULL")
    BigDecimal sumExperienceRevenueAfter(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COALESCE(SUM(eb.totalPrice), 0) FROM ExperienceBooking eb WHERE eb.status = 'CONFIRMED' AND eb.createdAt >= :startDate AND eb.createdAt < :endDate AND eb.deletedAt IS NULL")
    BigDecimal sumExperienceRevenueBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Host-specific revenue queries
    @Query("SELECT COUNT(eb) FROM ExperienceBooking eb WHERE eb.session.experienceListing.host.id = :hostId AND eb.deletedAt IS NULL")
    Long countExperienceBookingsByHostId(@Param("hostId") UUID hostId);
    
    @Query("SELECT COUNT(eb) FROM ExperienceBooking eb WHERE eb.session.experienceListing.host.id = :hostId AND eb.createdAt >= :startDate AND eb.createdAt < :endDate AND eb.deletedAt IS NULL")
    Long countExperienceBookingsByHostIdBetween(@Param("hostId") UUID hostId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COALESCE(SUM(eb.totalPrice), 0) FROM ExperienceBooking eb WHERE eb.session.experienceListing.host.id = :hostId AND eb.status = 'CONFIRMED' AND eb.deletedAt IS NULL")
    BigDecimal sumExperienceRevenueByHostId(@Param("hostId") UUID hostId);
    
    @Query("SELECT COALESCE(SUM(eb.totalPrice), 0) FROM ExperienceBooking eb WHERE eb.session.experienceListing.host.id = :hostId AND eb.status = 'CONFIRMED' AND eb.createdAt >= :startDate AND eb.createdAt < :endDate AND eb.deletedAt IS NULL")
    BigDecimal sumExperienceRevenueByHostIdBetween(@Param("hostId") UUID hostId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
