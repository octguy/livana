package octguy.livanabe.repository;

import octguy.livanabe.entity.ExperienceListing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ExperienceListingRepository extends JpaRepository<ExperienceListing, UUID> {
}
