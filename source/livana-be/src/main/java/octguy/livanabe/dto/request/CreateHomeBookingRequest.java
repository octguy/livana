package octguy.livanabe.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CreateHomeBookingRequest {

    @NotNull(message = "Home listing ID is required")
    private UUID homeListingId;

    @NotNull(message = "Check-in time is required")
    @Future(message = "Check-in time must be in the future")
    private LocalDateTime checkInTime;

    @NotNull(message = "Check-out time is required")
    @Future(message = "Check-out time must be in the future")
    private LocalDateTime checkOutTime;

    @Min(value = 1, message = "At least 1 guest is required")
    private int guests;
}
