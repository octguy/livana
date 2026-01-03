package octguy.livanabe.repository;

import octguy.livanabe.entity.ListingImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface ListingImageRepository extends JpaRepository<ListingImage, UUID> {
    List<ListingImage> findByListingIdOrderByImageOrderAsc(UUID listingId);
    
    List<ListingImage> findByListingIdInOrderByImageOrderAsc(Set<UUID> listingIds);
    
    @Modifying
    @Query("DELETE FROM ListingImage li WHERE li.listing.id = :listingId")
    void deleteByListingId(UUID listingId);
}
