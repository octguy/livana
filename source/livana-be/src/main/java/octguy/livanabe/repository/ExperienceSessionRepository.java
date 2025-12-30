package octguy.livanabe.repository;

import octguy.livanabe.entity.ExperienceSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ExperienceSessionRepository extends JpaRepository<ExperienceSession, UUID> {
}
