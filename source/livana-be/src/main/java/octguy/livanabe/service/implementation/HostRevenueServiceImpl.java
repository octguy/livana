package octguy.livanabe.service.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import octguy.livanabe.dto.response.HostRevenuePeriodResponse;
import octguy.livanabe.dto.response.HostRevenueStatsResponse;
import octguy.livanabe.repository.ExperienceBookingRepository;
import octguy.livanabe.repository.ExperienceListingRepository;
import octguy.livanabe.repository.HomeBookingRepository;
import octguy.livanabe.repository.HomeListingRepository;
import octguy.livanabe.service.IHostRevenueService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class HostRevenueServiceImpl implements IHostRevenueService {

    private final HomeListingRepository homeListingRepository;
    private final ExperienceListingRepository experienceListingRepository;
    private final HomeBookingRepository homeBookingRepository;
    private final ExperienceBookingRepository experienceBookingRepository;

    @Override
    public HostRevenueStatsResponse getHostOverallStats(UUID hostId) {
        log.debug("Getting overall revenue statistics for host: {}", hostId);

        // Listing statistics
        Long totalHomeListings = homeListingRepository.countByHostId(hostId);
        Long totalExperienceListings = experienceListingRepository.countByHostId(hostId);
        Long totalListings = totalHomeListings + totalExperienceListings;

        // Booking statistics
        Long totalHomeBookings = homeBookingRepository.countHomeBookingsByHostId(hostId);
        Long totalExperienceBookings = experienceBookingRepository.countExperienceBookingsByHostId(hostId);
        Long totalBookings = totalHomeBookings + totalExperienceBookings;

        // Revenue statistics
        BigDecimal totalHomeRevenue = homeBookingRepository.sumHomeRevenueByHostId(hostId);
        BigDecimal totalExperienceRevenue = experienceBookingRepository.sumExperienceRevenueByHostId(hostId);
        BigDecimal totalRevenue = totalHomeRevenue.add(totalExperienceRevenue);

        return HostRevenueStatsResponse.builder()
                .totalHomeListings(totalHomeListings)
                .totalExperienceListings(totalExperienceListings)
                .totalListings(totalListings)
                .totalHomeBookings(totalHomeBookings)
                .totalExperienceBookings(totalExperienceBookings)
                .totalBookings(totalBookings)
                .totalHomeRevenue(totalHomeRevenue)
                .totalExperienceRevenue(totalExperienceRevenue)
                .totalRevenue(totalRevenue)
                .build();
    }

    @Override
    public HostRevenuePeriodResponse getHostPeriodStats(UUID hostId, String period, LocalDate startDate, LocalDate endDate) {
        log.debug("Getting period revenue statistics for host: {}, period={}, startDate={}, endDate={}", 
                hostId, period, startDate, endDate);

        List<HostRevenuePeriodResponse.DataPoint> homeBookingGrowth = new ArrayList<>();
        List<HostRevenuePeriodResponse.DataPoint> experienceBookingGrowth = new ArrayList<>();
        List<HostRevenuePeriodResponse.RevenueDataPoint> homeRevenueGrowth = new ArrayList<>();
        List<HostRevenuePeriodResponse.RevenueDataPoint> experienceRevenueGrowth = new ArrayList<>();

        DateTimeFormatter formatter = getFormatterForPeriod(period);

        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            LocalDate next = getNextDate(current, period);
            if (next.isAfter(endDate.plusDays(1))) {
                next = endDate.plusDays(1);
            }

            LocalDateTime periodStart = current.atStartOfDay();
            LocalDateTime periodEnd = next.atStartOfDay();
            String label = current.format(formatter);

            // Home bookings for this period
            Long homeBookings = homeBookingRepository.countHomeBookingsByHostIdBetween(hostId, periodStart, periodEnd);
            homeBookingGrowth.add(HostRevenuePeriodResponse.DataPoint.builder()
                    .label(label)
                    .value(homeBookings)
                    .build());

            // Experience bookings for this period
            Long experienceBookings = experienceBookingRepository.countExperienceBookingsByHostIdBetween(hostId, periodStart, periodEnd);
            experienceBookingGrowth.add(HostRevenuePeriodResponse.DataPoint.builder()
                    .label(label)
                    .value(experienceBookings)
                    .build());

            // Home revenue for this period
            BigDecimal homeRevenue = homeBookingRepository.sumHomeRevenueByHostIdBetween(hostId, periodStart, periodEnd);
            homeRevenueGrowth.add(HostRevenuePeriodResponse.RevenueDataPoint.builder()
                    .label(label)
                    .value(homeRevenue)
                    .build());

            // Experience revenue for this period
            BigDecimal experienceRevenue = experienceBookingRepository.sumExperienceRevenueByHostIdBetween(hostId, periodStart, periodEnd);
            experienceRevenueGrowth.add(HostRevenuePeriodResponse.RevenueDataPoint.builder()
                    .label(label)
                    .value(experienceRevenue)
                    .build());

            current = next;
        }

        return HostRevenuePeriodResponse.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .homeBookingGrowth(homeBookingGrowth)
                .experienceBookingGrowth(experienceBookingGrowth)
                .homeRevenueGrowth(homeRevenueGrowth)
                .experienceRevenueGrowth(experienceRevenueGrowth)
                .build();
    }

    private DateTimeFormatter getFormatterForPeriod(String period) {
        return switch (period.toUpperCase()) {
            case "DAY" -> DateTimeFormatter.ofPattern("MM/dd");
            case "MONTH" -> DateTimeFormatter.ofPattern("MM/yyyy");
            case "YEAR" -> DateTimeFormatter.ofPattern("yyyy");
            default -> DateTimeFormatter.ofPattern("MM/dd");
        };
    }

    private LocalDate getNextDate(LocalDate current, String period) {
        return switch (period.toUpperCase()) {
            case "DAY" -> current.plusDays(1);
            case "MONTH" -> current.plusMonths(1);
            case "YEAR" -> current.plusYears(1);
            default -> current.plusDays(1);
        };
    }
}
