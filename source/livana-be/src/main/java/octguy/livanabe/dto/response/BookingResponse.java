package octguy.livanabe.dto.response;

import lombok.Data;
import octguy.livanabe.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class BookingResponse {
    private UUID id;
    private UUID customerId;
    private String customerName;
    private BigDecimal totalPrice;
    private BookingStatus status;
    private Boolean isPaid;
    private LocalDateTime createdAt;
}
