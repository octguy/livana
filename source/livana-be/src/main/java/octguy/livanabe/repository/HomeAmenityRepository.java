package octguy.livanabe.repository;

import octguy.livanabe.entity.HomeAmenity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface HomeAmenityRepository extends JpaRepository<HomeAmenity, UUID> {
    List<HomeAmenity> findByListingId(UUID listingId);
}
