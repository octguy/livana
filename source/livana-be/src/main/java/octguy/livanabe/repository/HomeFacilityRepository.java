package octguy.livanabe.repository;

import octguy.livanabe.entity.HomeFacility;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface HomeFacilityRepository extends JpaRepository<HomeFacility, UUID> {
    List<HomeFacility> findByListingId(UUID listingId);
}
