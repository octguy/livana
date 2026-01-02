package octguy.livanabe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PeriodStatsResponse {
    
    private String period; // DAY, MONTH, YEAR
    private LocalDate startDate;
    private LocalDate endDate;
    
    // User growth
    private List<DataPoint> userGrowth;
    
    // Listing growth
    private List<DataPoint> homeListingGrowth;
    private List<DataPoint> experienceListingGrowth;
    
    // Booking growth
    private List<DataPoint> homeBookingGrowth;
    private List<DataPoint> experienceBookingGrowth;
    
    // Revenue growth
    private List<RevenueDataPoint> homeRevenueGrowth;
    private List<RevenueDataPoint> experienceRevenueGrowth;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DataPoint {
        private String label;
        private Long value;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RevenueDataPoint {
        private String label;
        private BigDecimal value;
    }
}
