package octguy.livanabe.service;

import octguy.livanabe.dto.response.ComparisonStatsResponse;
import octguy.livanabe.dto.response.DashboardStatsResponse;
import octguy.livanabe.dto.response.PeriodStatsResponse;

import java.time.LocalDate;

public interface IDashboardService {
    
    /**
     * Get overall dashboard statistics
     */
    DashboardStatsResponse getOverallStats();
    
    /**
     * Get statistics for a specific period
     * @param period DAY, MONTH, YEAR
     * @param startDate Start date for the period
     * @param endDate End date for the period
     */
    PeriodStatsResponse getPeriodStats(String period, LocalDate startDate, LocalDate endDate);
    
    /**
     * Get comparison statistics between Home and Experience
     * @param period DAY, MONTH, YEAR
     * @param startDate Start date for the period
     * @param endDate End date for the period
     */
    ComparisonStatsResponse getComparisonStats(String period, LocalDate startDate, LocalDate endDate);
}
