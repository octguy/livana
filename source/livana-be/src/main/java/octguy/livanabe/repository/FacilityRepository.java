package octguy.livanabe.repository;

import octguy.livanabe.entity.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface FacilityRepository extends JpaRepository<Facility, UUID> {

    @Modifying
    @Query(value = "DELETE FROM facility WHERE id = :id", nativeQuery = true)
    void hardDeleteById(@Param("id") UUID id);

    @Modifying
    @Query(value = "DELETE FROM facility", nativeQuery = true)
    void hardDeleteAll();
}
