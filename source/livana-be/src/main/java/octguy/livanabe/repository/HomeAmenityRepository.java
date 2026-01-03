package octguy.livanabe.repository;

import octguy.livanabe.entity.HomeAmenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface HomeAmenityRepository extends JpaRepository<HomeAmenity, UUID> {
    List<HomeAmenity> findByListingId(UUID listingId);
    
    @Modifying
    @Query("DELETE FROM HomeAmenity ha WHERE ha.listing.id = :listingId")
    void deleteByListingId(UUID listingId);
}
