package octguy.livanabe.repository;

import octguy.livanabe.entity.BaseListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BaseListingRepository extends JpaRepository<BaseListing, UUID> {
}
