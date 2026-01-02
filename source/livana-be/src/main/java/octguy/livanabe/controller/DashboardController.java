package octguy.livanabe.controller;

import lombok.RequiredArgsConstructor;
import octguy.livanabe.dto.response.ComparisonStatsResponse;
import octguy.livanabe.dto.response.DashboardStatsResponse;
import octguy.livanabe.dto.response.PeriodStatsResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.IDashboardService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final IDashboardService dashboardService;

    /**
     * Get overall dashboard statistics
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getOverallStats() {
        DashboardStatsResponse stats = dashboardService.getOverallStats();

        ApiResponse<DashboardStatsResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Dashboard statistics retrieved successfully",
                stats,
                null
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Get statistics for a specific period (growth data)
     * @param period DAY, MONTH, YEAR
     * @param startDate Start date (format: yyyy-MM-dd)
     * @param endDate End date (format: yyyy-MM-dd)
     */
    @GetMapping("/stats/period")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PeriodStatsResponse>> getPeriodStats(
            @RequestParam(defaultValue = "DAY") String period,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        PeriodStatsResponse stats = dashboardService.getPeriodStats(period, startDate, endDate);

        ApiResponse<PeriodStatsResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Period statistics retrieved successfully",
                stats,
                null
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Get comparison statistics between Home and Experience
     * @param period DAY, MONTH, YEAR
     * @param startDate Start date (format: yyyy-MM-dd)
     * @param endDate End date (format: yyyy-MM-dd)
     */
    @GetMapping("/stats/comparison")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ComparisonStatsResponse>> getComparisonStats(
            @RequestParam(defaultValue = "DAY") String period,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        ComparisonStatsResponse stats = dashboardService.getComparisonStats(period, startDate, endDate);

        ApiResponse<ComparisonStatsResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Comparison statistics retrieved successfully",
                stats,
                null
        );

        return ResponseEntity.ok(response);
    }
}
