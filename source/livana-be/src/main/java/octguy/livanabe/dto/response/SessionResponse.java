package octguy.livanabe.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class SessionResponse {

    private UUID id;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private int capacity;

    private int bookedCount;

    private int availableSlots; // capacity - bookedCount

    private BigDecimal price;

    private String status;

    private LocalDateTime createdAt;
}
