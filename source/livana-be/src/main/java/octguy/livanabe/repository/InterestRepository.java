package octguy.livanabe.repository;

import octguy.livanabe.entity.Interest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface InterestRepository extends JpaRepository<Interest, UUID> {

    @Modifying
    @Query(value = "DELETE FROM interest WHERE id = :id", nativeQuery = true)
    void hardDeleteById(@Param("id") UUID id);

    @Modifying
    @Query(value = "DELETE FROM interest", nativeQuery = true)
    void hardDeleteAll();
}
