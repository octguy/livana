package octguy.livanabe.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
public class HomeBookingResponse extends BookingResponse {
    private UUID homeListingId;
    private String homeListingTitle;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private int guests;
}
