package octguy.livanabe.repository;

import octguy.livanabe.entity.ExperienceCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ExperienceCategoryRepository extends JpaRepository<ExperienceCategory, UUID> {
}
