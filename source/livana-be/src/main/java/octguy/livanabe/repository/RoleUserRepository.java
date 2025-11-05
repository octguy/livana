package octguy.livanabe.repository;

import octguy.livanabe.entity.RoleUser;
import octguy.livanabe.entity.composite_key.RoleUserId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleUserRepository extends JpaRepository<RoleUser, RoleUserId> {
}
