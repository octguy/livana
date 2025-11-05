package octguy.livanabe.repository;

import octguy.livanabe.entity.Role;
import octguy.livanabe.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {

    Optional<Role> findByName(UserRole name);
}
