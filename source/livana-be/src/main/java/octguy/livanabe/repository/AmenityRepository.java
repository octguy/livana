package octguy.livanabe.repository;

import octguy.livanabe.entity.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface AmenityRepository extends JpaRepository<Amenity, UUID> {

    @Modifying
    @Query(value = "DELETE FROM amenity WHERE id = :id", nativeQuery = true)
    void hardDeleteById(@Param("id") UUID id);

    @Modifying
    @Query(value = "DELETE FROM amenity", nativeQuery = true)
    void hardDeleteAll();
}
