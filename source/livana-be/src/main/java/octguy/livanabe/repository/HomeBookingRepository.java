package octguy.livanabe.repository;

import octguy.livanabe.entity.HomeBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface HomeBookingRepository extends JpaRepository<HomeBooking, UUID> {
    
    List<HomeBooking> findByCustomerId(UUID customerId);
    
    List<HomeBooking> findByHomeListingId(UUID homeListingId);
    
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
}
