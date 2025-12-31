package octguy.livanabe.service.implementation;

import lombok.RequiredArgsConstructor;
import octguy.livanabe.dto.request.CreateHomeBookingRequest;
import octguy.livanabe.dto.response.HomeBookingResponse;
import octguy.livanabe.dto.response.NotificationMessage;
import octguy.livanabe.entity.HomeListing;
import octguy.livanabe.entity.HomeBooking;
import octguy.livanabe.entity.User;
import octguy.livanabe.entity.UserProfile;
import octguy.livanabe.enums.BookingStatus;
import octguy.livanabe.exception.BadRequestException;
import octguy.livanabe.exception.ResourceNotFoundException;
import octguy.livanabe.repository.HomeBookingRepository;
import octguy.livanabe.repository.HomeListingRepository;
import octguy.livanabe.repository.UserRepository;
import octguy.livanabe.repository.UserProfileRepository;
import octguy.livanabe.service.IHomeBookingService;
import octguy.livanabe.service.INotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeBookingServiceImpl implements IHomeBookingService {

    private final HomeBookingRepository homeBookingRepository;
    private final HomeListingRepository homeListingRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final INotificationService notificationService;

    @Override
    @Transactional
    public HomeBookingResponse createBooking(CreateHomeBookingRequest request, UUID customerId) {
        // Validate customer
        User customer = userRepository.findById(customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        // Validate home listing
        HomeListing homeListing = homeListingRepository.findById(request.getHomeListingId())
            .orElseThrow(() -> new ResourceNotFoundException("Home listing not found"));

        // Validate dates
        if (request.getCheckOutTime().isBefore(request.getCheckInTime())) {
            throw new BadRequestException("Check-out time must be after check-in time");
        }

        // Validate capacity
        if (request.getGuests() > homeListing.getCapacity()) {
            throw new BadRequestException("Number of guests exceeds listing capacity");
        }

        // Check for conflicting bookings
        List<HomeBooking> conflictingBookings = homeBookingRepository.findConflictingBookings(
            request.getHomeListingId(),
            request.getCheckInTime(),
            request.getCheckOutTime()
        );

        if (!conflictingBookings.isEmpty()) {
            throw new BadRequestException("This listing is already booked for the selected dates");
        }

        // Calculate total price
        long nights = ChronoUnit.DAYS.between(
            request.getCheckInTime().toLocalDate(),
            request.getCheckOutTime().toLocalDate()
        );
        BigDecimal totalPrice = homeListing.getBasePrice().multiply(BigDecimal.valueOf(nights));

        // Create booking
        HomeBooking booking = new HomeBooking();
        booking.setCustomer(customer);
        booking.setHomeListing(homeListing);
        booking.setCheckInTime(request.getCheckInTime());
        booking.setCheckOutTime(request.getCheckOutTime());
        booking.setGuests(request.getGuests());
        booking.setTotalPrice(totalPrice);
        booking.setStatus(BookingStatus.PENDING);
        booking.setIsPaid(false);

        HomeBooking savedBooking = homeBookingRepository.save(booking);
        
        // Send notification to host
        HomeBookingResponse bookingResponse = convertToResponse(savedBooking);
        sendBookingNotificationToHost(homeListing, bookingResponse);
        
        return bookingResponse;
    }
    
    private void sendBookingNotificationToHost(HomeListing listing, HomeBookingResponse booking) {
        UUID hostId = listing.getHost().getId();
        
        NotificationMessage notification = NotificationMessage.builder()
                .id(UUID.randomUUID())
                .recipientId(hostId)
                .type("BOOKING_HOME")
                .title("Đặt phòng mới!")
                .message(String.format("%s đã đặt '%s' từ %s đến %s",
                        booking.getCustomerName(),
                        listing.getTitle(),
                        booking.getCheckInTime().toLocalDate(),
                        booking.getCheckOutTime().toLocalDate()))
                .data(booking)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();
        
        notificationService.sendBookingNotificationToHost(hostId, notification);
    }

    @Override
    public HomeBookingResponse getBookingById(UUID bookingId) {
        HomeBooking booking = homeBookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return convertToResponse(booking);
    }

    @Override
    public List<HomeBookingResponse> getCustomerBookings(UUID customerId) {
        return homeBookingRepository.findByCustomerId(customerId).stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public List<HomeBookingResponse> getListingBookings(UUID homeListingId) {
        return homeBookingRepository.findByHomeListingId(homeListingId).stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public HomeBookingResponse cancelBooking(UUID bookingId, UUID customerId) {
        HomeBooking booking = homeBookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getCustomer().getId().equals(customerId)) {
            throw new BadRequestException("You can only cancel your own bookings");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        HomeBooking savedBooking = homeBookingRepository.save(booking);
        return convertToResponse(savedBooking);
    }

    private HomeBookingResponse convertToResponse(HomeBooking booking) {
        HomeBookingResponse response = new HomeBookingResponse();
        response.setId(booking.getId());
        response.setCustomerId(booking.getCustomer().getId());
        
        // Fetch customer name from UserProfile
        String customerName = userProfileRepository.findByUserId(booking.getCustomer().getId())
            .map(UserProfile::getDisplayName)
            .orElse(booking.getCustomer().getUsername());
        response.setCustomerName(customerName);
        
        response.setHomeListingId(booking.getHomeListing().getId());
        response.setHomeListingTitle(booking.getHomeListing().getTitle());
        response.setCheckInTime(booking.getCheckInTime());
        response.setCheckOutTime(booking.getCheckOutTime());
        response.setGuests(booking.getGuests());
        response.setTotalPrice(booking.getTotalPrice());
        response.setStatus(booking.getStatus());
        response.setIsPaid(booking.getIsPaid());
        response.setCreatedAt(booking.getCreatedAt());
        return response;
    }
}
