package octguy.livanabe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import octguy.livanabe.enums.PaymentMethod;
import octguy.livanabe.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class PaymentResponse {
    
    private UUID id;
    private UUID bookingId;
    private UUID userId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private String transactionId;
    private String vnpayTransactionNo;
    private String bankCode;
    private String cardType;
    private String orderInfo;
    private LocalDateTime paymentTime;
    private LocalDateTime createdAt;
}
