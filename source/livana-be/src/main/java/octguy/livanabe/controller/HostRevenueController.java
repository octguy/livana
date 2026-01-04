package octguy.livanabe.controller;

import lombok.RequiredArgsConstructor;
import octguy.livanabe.dto.response.HostRevenuePeriodResponse;
import octguy.livanabe.dto.response.HostRevenueStatsResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.IHostRevenueService;
import octguy.livanabe.utils.SecurityUtils;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/host/revenue")
@RequiredArgsConstructor
public class HostRevenueController {

    private final IHostRevenueService hostRevenueService;

    /**
     * Get overall revenue statistics for the authenticated host
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<HostRevenueStatsResponse>> getOverallStats() {
        UUID hostId = SecurityUtils.getCurrentUser().getId();
        HostRevenueStatsResponse stats = hostRevenueService.getHostOverallStats(hostId);

        ApiResponse<HostRevenueStatsResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Host revenue statistics retrieved successfully",
                stats,
                null
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Get revenue statistics for a specific period
     * @param period DAY, MONTH, YEAR
     * @param startDate Start date (format: yyyy-MM-dd)
     * @param endDate End date (format: yyyy-MM-dd)
     */
    @GetMapping("/stats/period")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<HostRevenuePeriodResponse>> getPeriodStats(
            @RequestParam(defaultValue = "DAY") String period,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        UUID hostId = SecurityUtils.getCurrentUser().getId();
        HostRevenuePeriodResponse stats = hostRevenueService.getHostPeriodStats(hostId, period, startDate, endDate);

        ApiResponse<HostRevenuePeriodResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Host period statistics retrieved successfully",
                stats,
                null
        );

        return ResponseEntity.ok(response);
    }
}
