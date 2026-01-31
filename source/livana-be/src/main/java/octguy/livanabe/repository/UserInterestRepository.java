package octguy.livanabe.repository;

import octguy.livanabe.entity.UserInterest;
import octguy.livanabe.entity.composite_key.UserInterestId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserInterestRepository extends JpaRepository<UserInterest, UserInterestId> {
}
