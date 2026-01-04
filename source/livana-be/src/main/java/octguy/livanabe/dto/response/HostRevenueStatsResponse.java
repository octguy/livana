package octguy.livanabe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HostRevenueStatsResponse {
    
    // Overall statistics
    private Long totalHomeListings;
    private Long totalExperienceListings;
    private Long totalListings;
    
    // Booking statistics
    private Long totalHomeBookings;
    private Long totalExperienceBookings;
    private Long totalBookings;
    
    // Revenue statistics
    private BigDecimal totalHomeRevenue;
    private BigDecimal totalExperienceRevenue;
    private BigDecimal totalRevenue;
}
