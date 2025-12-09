package octguy.livanabe.repository;

import octguy.livanabe.entity.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AmenityRepository extends JpaRepository<Amenity, UUID> {
}
