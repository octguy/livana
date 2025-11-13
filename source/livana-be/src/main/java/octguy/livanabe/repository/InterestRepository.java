package octguy.livanabe.repository;

import octguy.livanabe.entity.Interest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface InterestRepository extends JpaRepository<Interest, UUID> {
}
