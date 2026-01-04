package octguy.livanabe.repository;

import octguy.livanabe.entity.ExperienceListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ExperienceListingRepository extends JpaRepository<ExperienceListing, UUID> {
    
    List<ExperienceListing> findByHostId(UUID hostId);
    
    // Search by bounding box (for location-based search)
    @Query("SELECT e FROM ExperienceListing e WHERE e.deletedAt IS NULL " +
           "AND e.isAvailable = true " +
           "AND e.latitude BETWEEN :minLat AND :maxLat " +
           "AND e.longitude BETWEEN :minLon AND :maxLon")
    List<ExperienceListing> findByLocationBoundingBox(
            @Param("minLat") Double minLat,
            @Param("maxLat") Double maxLat,
            @Param("minLon") Double minLon,
            @Param("maxLon") Double maxLon
    );
    
    // Search with filters
    @Query("SELECT e FROM ExperienceListing e WHERE e.deletedAt IS NULL " +
           "AND e.isAvailable = true " +
           "AND e.latitude BETWEEN :minLat AND :maxLat " +
           "AND e.longitude BETWEEN :minLon AND :maxLon " +
           "AND (:minPrice IS NULL OR e.basePrice >= :minPrice) " +
           "AND (:maxPrice IS NULL OR e.basePrice <= :maxPrice) " +
           "AND (:minCapacity IS NULL OR e.capacity >= :minCapacity) " +
           "AND (:categoryId IS NULL OR e.experienceCategory.id = :categoryId)")
    List<ExperienceListing> findByLocationWithFilters(
            @Param("minLat") Double minLat,
            @Param("maxLat") Double maxLat,
            @Param("minLon") Double minLon,
            @Param("maxLon") Double maxLon,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minCapacity") Integer minCapacity,
            @Param("categoryId") UUID categoryId
    );
    
    // Dashboard statistics queries
    @Query("SELECT COUNT(e) FROM ExperienceListing e WHERE e.deletedAt IS NULL")
    Long countAllActiveExperienceListings();
    
    @Query("SELECT COUNT(e) FROM ExperienceListing e WHERE e.createdAt >= :startDate AND e.deletedAt IS NULL")
    Long countExperienceListingsCreatedAfter(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(e) FROM ExperienceListing e WHERE e.createdAt >= :startDate AND e.createdAt < :endDate AND e.deletedAt IS NULL")
    Long countExperienceListingsCreatedBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Host-specific queries
    @Query("SELECT COUNT(e) FROM ExperienceListing e WHERE e.host.id = :hostId AND e.deletedAt IS NULL")
    Long countByHostId(@Param("hostId") UUID hostId);
}
