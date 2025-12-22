package octguy.livanabe.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name="base_listing")
@Getter
@Setter
@SQLRestriction("deleted_at IS NULL")
@Inheritance(strategy =  InheritanceType.JOINED)
public abstract class BaseListing extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "host_id", referencedColumnName = "id", nullable = false)
    private User host;

    @Column(name="title", nullable = false, length = 200)
    private String title;

    @Column(name="description", nullable = false, length = 1000)
    private String description;

    @Column(name="address", nullable = false, length = 300)
    private String address;

    @Column(name="latitude", nullable = false)
    private Double latitude;

    @Column(name="longitude", nullable = false)
    private Double longitude;

    @Column(name="capacity", nullable = false)
    private int capacity;

    @Column(name="base_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    @Column(name="is_available", nullable = false)
    private Boolean isAvailable;
}
