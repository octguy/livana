package octguy.livanabe.repository;

import octguy.livanabe.entity.HomeListing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface HomeListingRepository extends JpaRepository<HomeListing, UUID> {
    List<HomeListing> findByHostId(UUID hostId);
}
