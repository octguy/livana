package octguy.livanabe.service.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import octguy.livanabe.dto.response.ComparisonStatsResponse;
import octguy.livanabe.dto.response.DashboardStatsResponse;
import octguy.livanabe.dto.response.PeriodStatsResponse;
import octguy.livanabe.repository.*;
import octguy.livanabe.service.IDashboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DashboardServiceImpl implements IDashboardService {

    private final UserRepository userRepository;
    private final HomeListingRepository homeListingRepository;
    private final ExperienceListingRepository experienceListingRepository;
    private final HomeBookingRepository homeBookingRepository;
    private final ExperienceBookingRepository experienceBookingRepository;

    @Override
    public DashboardStatsResponse getOverallStats() {
        log.debug("Getting overall dashboard statistics");

        // User statistics
        Long totalUsers = userRepository.countAllActiveUsers();
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        Long newUsersToday = userRepository.countUsersCreatedAfter(todayStart);

        // Listing statistics
        Long totalHomeListings = homeListingRepository.countAllActiveHomeListings();
        Long totalExperienceListings = experienceListingRepository.countAllActiveExperienceListings();
        Long totalListings = totalHomeListings + totalExperienceListings;

        // Booking statistics
        Long totalHomeBookings = homeBookingRepository.countAllActiveHomeBookings();
        Long totalExperienceBookings = experienceBookingRepository.countAllActiveExperienceBookings();
        Long totalBookings = totalHomeBookings + totalExperienceBookings;

        // Revenue statistics
        BigDecimal totalHomeRevenue = homeBookingRepository.sumAllHomeRevenue();
        BigDecimal totalExperienceRevenue = experienceBookingRepository.sumAllExperienceRevenue();
        BigDecimal totalRevenue = totalHomeRevenue.add(totalExperienceRevenue);

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .newUsersToday(newUsersToday)
                .activeUsers(totalUsers) // For now, same as total users
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
    public PeriodStatsResponse getPeriodStats(String period, LocalDate startDate, LocalDate endDate) {
        log.debug("Getting period statistics: period={}, startDate={}, endDate={}", period, startDate, endDate);

        List<PeriodStatsResponse.DataPoint> userGrowth = new ArrayList<>();
        List<PeriodStatsResponse.DataPoint> homeListingGrowth = new ArrayList<>();
        List<PeriodStatsResponse.DataPoint> experienceListingGrowth = new ArrayList<>();
        List<PeriodStatsResponse.DataPoint> homeBookingGrowth = new ArrayList<>();
        List<PeriodStatsResponse.DataPoint> experienceBookingGrowth = new ArrayList<>();
        List<PeriodStatsResponse.RevenueDataPoint> homeRevenueGrowth = new ArrayList<>();
        List<PeriodStatsResponse.RevenueDataPoint> experienceRevenueGrowth = new ArrayList<>();

        DateTimeFormatter formatter = getFormatterForPeriod(period);
        
        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            LocalDate next = getNextDate(current, period);
            if (next.isAfter(endDate)) {
                next = endDate.plusDays(1);
            }

            LocalDateTime periodStart = current.atStartOfDay();
            LocalDateTime periodEnd = next.atStartOfDay();
            String label = current.format(formatter);

            // User growth
            Long userCount = userRepository.countUsersCreatedBetween(periodStart, periodEnd);
            userGrowth.add(PeriodStatsResponse.DataPoint.builder()
                    .label(label)
                    .value(userCount)
                    .build());

            // Home listing growth
            Long homeListingCount = homeListingRepository.countHomeListingsCreatedBetween(periodStart, periodEnd);
            homeListingGrowth.add(PeriodStatsResponse.DataPoint.builder()
                    .label(label)
                    .value(homeListingCount)
                    .build());

            // Experience listing growth
            Long experienceListingCount = experienceListingRepository.countExperienceListingsCreatedBetween(periodStart, periodEnd);
            experienceListingGrowth.add(PeriodStatsResponse.DataPoint.builder()
                    .label(label)
                    .value(experienceListingCount)
                    .build());

            // Home booking growth
            Long homeBookingCount = homeBookingRepository.countHomeBookingsCreatedBetween(periodStart, periodEnd);
            homeBookingGrowth.add(PeriodStatsResponse.DataPoint.builder()
                    .label(label)
                    .value(homeBookingCount)
                    .build());

            // Experience booking growth
            Long experienceBookingCount = experienceBookingRepository.countExperienceBookingsCreatedBetween(periodStart, periodEnd);
            experienceBookingGrowth.add(PeriodStatsResponse.DataPoint.builder()
                    .label(label)
                    .value(experienceBookingCount)
                    .build());

            // Home revenue growth
            BigDecimal homeRevenue = homeBookingRepository.sumHomeRevenueBetween(periodStart, periodEnd);
            homeRevenueGrowth.add(PeriodStatsResponse.RevenueDataPoint.builder()
                    .label(label)
                    .value(homeRevenue)
                    .build());

            // Experience revenue growth
            BigDecimal experienceRevenue = experienceBookingRepository.sumExperienceRevenueBetween(periodStart, periodEnd);
            experienceRevenueGrowth.add(PeriodStatsResponse.RevenueDataPoint.builder()
                    .label(label)
                    .value(experienceRevenue)
                    .build());

            current = next;
        }

        return PeriodStatsResponse.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .userGrowth(userGrowth)
                .homeListingGrowth(homeListingGrowth)
                .experienceListingGrowth(experienceListingGrowth)
                .homeBookingGrowth(homeBookingGrowth)
                .experienceBookingGrowth(experienceBookingGrowth)
                .homeRevenueGrowth(homeRevenueGrowth)
                .experienceRevenueGrowth(experienceRevenueGrowth)
                .build();
    }

    @Override
    public ComparisonStatsResponse getComparisonStats(String period, LocalDate startDate, LocalDate endDate) {
        log.debug("Getting comparison statistics: period={}, startDate={}, endDate={}", period, startDate, endDate);

        List<ComparisonStatsResponse.ComparisonDataPoint> listingComparison = new ArrayList<>();
        List<ComparisonStatsResponse.ComparisonDataPoint> bookingComparison = new ArrayList<>();
        List<ComparisonStatsResponse.RevenueComparisonDataPoint> revenueComparison = new ArrayList<>();

        DateTimeFormatter formatter = getFormatterForPeriod(period);

        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            LocalDate next = getNextDate(current, period);
            if (next.isAfter(endDate)) {
                next = endDate.plusDays(1);
            }

            LocalDateTime periodStart = current.atStartOfDay();
            LocalDateTime periodEnd = next.atStartOfDay();
            String label = current.format(formatter);

            // Listing comparison
            Long homeListingCount = homeListingRepository.countHomeListingsCreatedBetween(periodStart, periodEnd);
            Long experienceListingCount = experienceListingRepository.countExperienceListingsCreatedBetween(periodStart, periodEnd);
            listingComparison.add(ComparisonStatsResponse.ComparisonDataPoint.builder()
                    .label(label)
                    .homeValue(homeListingCount)
                    .experienceValue(experienceListingCount)
                    .build());

            // Booking comparison
            Long homeBookingCount = homeBookingRepository.countHomeBookingsCreatedBetween(periodStart, periodEnd);
            Long experienceBookingCount = experienceBookingRepository.countExperienceBookingsCreatedBetween(periodStart, periodEnd);
            bookingComparison.add(ComparisonStatsResponse.ComparisonDataPoint.builder()
                    .label(label)
                    .homeValue(homeBookingCount)
                    .experienceValue(experienceBookingCount)
                    .build());

            // Revenue comparison
            BigDecimal homeRevenue = homeBookingRepository.sumHomeRevenueBetween(periodStart, periodEnd);
            BigDecimal experienceRevenue = experienceBookingRepository.sumExperienceRevenueBetween(periodStart, periodEnd);
            revenueComparison.add(ComparisonStatsResponse.RevenueComparisonDataPoint.builder()
                    .label(label)
                    .homeValue(homeRevenue)
                    .experienceValue(experienceRevenue)
                    .build());

            current = next;
        }

        return ComparisonStatsResponse.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .listingComparison(listingComparison)
                .bookingComparison(bookingComparison)
                .revenueComparison(revenueComparison)
                .build();
    }

    private DateTimeFormatter getFormatterForPeriod(String period) {
        return switch (period.toUpperCase()) {
            case "DAY" -> DateTimeFormatter.ofPattern("dd/MM");
            case "MONTH" -> DateTimeFormatter.ofPattern("MM/yyyy");
            case "YEAR" -> DateTimeFormatter.ofPattern("yyyy");
            default -> DateTimeFormatter.ofPattern("dd/MM/yyyy");
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
