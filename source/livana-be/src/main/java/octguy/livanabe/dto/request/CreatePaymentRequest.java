package octguy.livanabe.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import octguy.livanabe.enums.BookingType;

import java.util.UUID;

@Getter
@Setter
public class CreatePaymentRequest {
    
    @NotNull(message = "Booking ID is required")
    private UUID bookingId;
    
    @NotNull(message = "Booking type is required")
    private BookingType bookingType;
    
    private String bankCode;
    
    private String language = "vn";
}
