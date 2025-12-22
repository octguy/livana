package octguy.livanabe.repository;

import octguy.livanabe.entity.HomeAmenity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface HomeAmenityRepository extends JpaRepository<HomeAmenity, UUID> {
}
