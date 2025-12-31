package octguy.livanabe.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import octguy.livanabe.enums.BookingStatus;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name="booking")
@Getter
@Setter
@SQLRestriction("deleted_at IS NULL")
@Inheritance(strategy =  InheritanceType.JOINED)
public abstract class Booking extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "host_id", referencedColumnName = "id", nullable = false)
    private User customer;

    @Column(name="total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(name="status", nullable = false)
    private BookingStatus status;

    @Column(name="is_paid")
    private Boolean isPaid;
}
