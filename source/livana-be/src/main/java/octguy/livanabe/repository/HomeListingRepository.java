package octguy.livanabe.repository;

import octguy.livanabe.entity.HomeListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface HomeListingRepository extends JpaRepository<HomeListing, UUID> {
    List<HomeListing> findByHostId(UUID hostId);
    
    // Search by bounding box (for location-based search)
    @Query("SELECT h FROM HomeListing h WHERE h.deletedAt IS NULL " +
           "AND h.isAvailable = true " +
           "AND h.latitude BETWEEN :minLat AND :maxLat " +
           "AND h.longitude BETWEEN :minLon AND :maxLon")
    List<HomeListing> findByLocationBoundingBox(
            @Param("minLat") Double minLat,
            @Param("maxLat") Double maxLat,
            @Param("minLon") Double minLon,
            @Param("maxLon") Double maxLon
    );
    
    // Search with filters
    @Query("SELECT h FROM HomeListing h WHERE h.deletedAt IS NULL " +
           "AND h.isAvailable = true " +
           "AND h.latitude BETWEEN :minLat AND :maxLat " +
           "AND h.longitude BETWEEN :minLon AND :maxLon " +
           "AND (:minPrice IS NULL OR h.basePrice >= :minPrice) " +
           "AND (:maxPrice IS NULL OR h.basePrice <= :maxPrice) " +
           "AND (:minCapacity IS NULL OR h.capacity >= :minCapacity) " +
           "AND (:propertyTypeId IS NULL OR h.propertyType.id = :propertyTypeId)")
    List<HomeListing> findByLocationWithFilters(
            @Param("minLat") Double minLat,
            @Param("maxLat") Double maxLat,
            @Param("minLon") Double minLon,
            @Param("maxLon") Double maxLon,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minCapacity") Integer minCapacity,
            @Param("propertyTypeId") UUID propertyTypeId
    );
    
    // Dashboard statistics queries
    @Query("SELECT COUNT(h) FROM HomeListing h WHERE h.deletedAt IS NULL")
    Long countAllActiveHomeListings();
    
    @Query("SELECT COUNT(h) FROM HomeListing h WHERE h.createdAt >= :startDate AND h.deletedAt IS NULL")
    Long countHomeListingsCreatedAfter(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(h) FROM HomeListing h WHERE h.createdAt >= :startDate AND h.createdAt < :endDate AND h.deletedAt IS NULL")
    Long countHomeListingsCreatedBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Host-specific queries
    @Query("SELECT COUNT(h) FROM HomeListing h WHERE h.host.id = :hostId AND h.deletedAt IS NULL")
    Long countByHostId(@Param("hostId") UUID hostId);
}
