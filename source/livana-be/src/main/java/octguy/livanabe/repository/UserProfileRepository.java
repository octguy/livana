package octguy.livanabe.repository;

import octguy.livanabe.entity.UserProfile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserProfileRepository extends JpaRepository<UserProfile, UUID> {

    Optional<UserProfile> findByUserId(UUID userId);

    @Query(value = "select * from user_profile", nativeQuery = true)
    List<UserProfile> findAll();
}
