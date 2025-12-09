package octguy.livanabe.repository;

import octguy.livanabe.entity.PropertyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface PropertyTypeRepository extends JpaRepository<PropertyType, UUID> {

    @Modifying
    @Query(value = "DELETE FROM property_type WHERE id = :id", nativeQuery = true)
    void hardDeleteById(@Param("id") UUID id);

    @Modifying
    @Query(value = "DELETE FROM property_type", nativeQuery = true)
    void hardDeleteAll();
}
