package octguy.livanabe.repository;

import octguy.livanabe.entity.HomeBooking;
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
public interface HomeBookingRepository extends JpaRepository<HomeBooking, UUID> {
    
    List<HomeBooking> findByCustomerId(UUID customerId);
    
    List<HomeBooking> findByHomeListingId(UUID homeListingId);
    
    @Modifying
    @Query("DELETE FROM HomeBooking hb WHERE hb.homeListing.id = :homeListingId")
    void deleteByHomeListingId(@Param("homeListingId") UUID homeListingId);
    
    @Query("SELECT hb FROM HomeBooking hb WHERE hb.homeListing.host.id = :hostId ORDER BY hb.createdAt DESC")
    List<HomeBooking> findByHostId(@Param("hostId") UUID hostId);
    
    @Query("SELECT hb FROM HomeBooking hb WHERE hb.homeListing.id = :homeListingId " +
           "AND hb.status != 'CANCELLED' " +
           "AND ((hb.checkInTime < :checkOutTime AND hb.checkOutTime > :checkInTime))")
    List<HomeBooking> findConflictingBookings(
        @Param("homeListingId") UUID homeListingId,
        @Param("checkInTime") LocalDateTime checkInTime,
        @Param("checkOutTime") LocalDateTime checkOutTime
    );
    
    // Dashboard statistics queries
    @Query("SELECT COUNT(hb) FROM HomeBooking hb WHERE hb.deletedAt IS NULL")
    Long countAllActiveHomeBookings();
    
    @Query("SELECT COUNT(hb) FROM HomeBooking hb WHERE hb.createdAt >= :startDate AND hb.deletedAt IS NULL")
    Long countHomeBookingsCreatedAfter(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(hb) FROM HomeBooking hb WHERE hb.createdAt >= :startDate AND hb.createdAt < :endDate AND hb.deletedAt IS NULL")
    Long countHomeBookingsCreatedBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COALESCE(SUM(hb.totalPrice), 0) FROM HomeBooking hb WHERE hb.status = 'CONFIRMED' AND hb.deletedAt IS NULL")
    BigDecimal sumAllHomeRevenue();
    
    @Query("SELECT COALESCE(SUM(hb.totalPrice), 0) FROM HomeBooking hb WHERE hb.status = 'CONFIRMED' AND hb.createdAt >= :startDate AND hb.deletedAt IS NULL")
    BigDecimal sumHomeRevenueAfter(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COALESCE(SUM(hb.totalPrice), 0) FROM HomeBooking hb WHERE hb.status = 'CONFIRMED' AND hb.createdAt >= :startDate AND hb.createdAt < :endDate AND hb.deletedAt IS NULL")
    BigDecimal sumHomeRevenueBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
