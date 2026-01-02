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
public class ComparisonStatsResponse {
    
    private String period; // DAY, MONTH, YEAR
    private LocalDate startDate;
    private LocalDate endDate;
    
    // Listing comparison
    private List<ComparisonDataPoint> listingComparison;
    
    // Booking comparison
    private List<ComparisonDataPoint> bookingComparison;
    
    // Revenue comparison
    private List<RevenueComparisonDataPoint> revenueComparison;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComparisonDataPoint {
        private String label;
        private Long homeValue;
        private Long experienceValue;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RevenueComparisonDataPoint {
        private String label;
        private BigDecimal homeValue;
        private BigDecimal experienceValue;
    }
}
