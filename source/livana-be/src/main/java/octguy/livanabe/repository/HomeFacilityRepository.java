package octguy.livanabe.repository;

import octguy.livanabe.entity.HomeFacility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface HomeFacilityRepository extends JpaRepository<HomeFacility, UUID> {
    List<HomeFacility> findByListingId(UUID listingId);
    
    @Modifying
    @Query("DELETE FROM HomeFacility hf WHERE hf.listing.id = :listingId")
    void deleteByListingId(UUID listingId);
}
