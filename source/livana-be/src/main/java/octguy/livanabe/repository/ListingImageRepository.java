package octguy.livanabe.repository;

import octguy.livanabe.entity.ListingImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ListingImageRepository extends JpaRepository<ListingImage, UUID> {
}
