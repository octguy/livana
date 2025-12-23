package octguy.livanabe.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

import java.util.UUID;

@Entity
@Table(name="listing_image")
@Getter
@Setter
@SQLRestriction("deleted_at IS NULL")
public class ListingImage extends BaseEntity {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id")
    private BaseListing listing;

    @Column(name="image_url", nullable = false, length = 255)
    private String imageUrl;

    @Column(name="image_public_id", nullable = false, length = 255)
    private String imagePublicId;

    @Column(name="is_thumbnail", nullable = false)
    private boolean isThumbnail;

    @Column(name="image_order", nullable = false)
    private int imageOrder;
}
