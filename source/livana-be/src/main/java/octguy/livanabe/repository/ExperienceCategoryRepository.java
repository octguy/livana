package octguy.livanabe.repository;

import octguy.livanabe.entity.ExperienceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ExperienceCategoryRepository extends JpaRepository<ExperienceCategory, UUID> {

    @Modifying
    @Query(value = "DELETE FROM experience_category WHERE id = :id", nativeQuery = true)
    void hardDeleteById(@Param("id") UUID id);

    @Modifying
    @Query(value = "DELETE FROM experience_category", nativeQuery = true)
    void hardDeleteAll();
}
