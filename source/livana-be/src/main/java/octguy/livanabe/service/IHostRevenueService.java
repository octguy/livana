package octguy.livanabe.service;

import octguy.livanabe.dto.response.HostRevenuePeriodResponse;
import octguy.livanabe.dto.response.HostRevenueStatsResponse;

import java.time.LocalDate;
import java.util.UUID;

public interface IHostRevenueService {
    
    /**
     * Get overall revenue statistics for a host
     */
    HostRevenueStatsResponse getHostOverallStats(UUID hostId);
    
    /**
     * Get revenue statistics for a specific period
     * @param hostId The host's UUID
     * @param period DAY, MONTH, YEAR
     * @param startDate Start date for the period
     * @param endDate End date for the period
     */
    HostRevenuePeriodResponse getHostPeriodStats(UUID hostId, String period, LocalDate startDate, LocalDate endDate);
}
