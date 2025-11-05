package octguy.livanabe.repository;

import octguy.livanabe.entity.AuthCredential;
import octguy.livanabe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AuthCredentialRepository extends JpaRepository<AuthCredential, UUID> {

    Optional<AuthCredential> findByUser(User user);

    List<AuthCredential> findAllByUserIn(List<User> users);
}
