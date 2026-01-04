package octguy.livanabe.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import octguy.livanabe.enums.PaymentMethod;
import octguy.livanabe.enums.PaymentStatus;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "payment")
@SQLRestriction("deleted_at IS NULL")
public class Payment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "booking_id", referencedColumnName = "id", nullable = false)
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(name = "amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PaymentStatus status;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "vnpay_transaction_no")
    private String vnpayTransactionNo;

    @Column(name = "bank_code")
    private String bankCode;

    @Column(name = "card_type")
    private String cardType;

    @Column(name = "order_info")
    private String orderInfo;

    @Column(name = "payment_time")
    private LocalDateTime paymentTime;

    @Column(name = "response_code")
    private String responseCode;
}
