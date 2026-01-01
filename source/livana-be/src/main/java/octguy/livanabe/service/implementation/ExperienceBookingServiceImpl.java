package octguy.livanabe.service.implementation;

import lombok.RequiredArgsConstructor;
import octguy.livanabe.dto.request.CreateExperienceBookingRequest;
import octguy.livanabe.dto.response.ExperienceBookingResponse;
import octguy.livanabe.dto.response.NotificationMessage;
import octguy.livanabe.entity.ExperienceBooking;
import octguy.livanabe.entity.ExperienceListing;
import octguy.livanabe.entity.ExperienceSession;
import octguy.livanabe.entity.User;
import octguy.livanabe.entity.UserProfile;
import octguy.livanabe.enums.BookingStatus;
import octguy.livanabe.enums.SessionStatus;
import octguy.livanabe.exception.BadRequestException;
import octguy.livanabe.exception.ResourceNotFoundException;
import octguy.livanabe.repository.ExperienceBookingRepository;
import octguy.livanabe.repository.ExperienceSessionRepository;
import octguy.livanabe.repository.UserRepository;
import octguy.livanabe.repository.UserProfileRepository;
import octguy.livanabe.service.IExperienceBookingService;
import octguy.livanabe.service.INotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExperienceBookingServiceImpl implements IExperienceBookingService {

    private final ExperienceBookingRepository experienceBookingRepository;
    private final ExperienceSessionRepository experienceSessionRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final INotificationService notificationService;

    @Override
    @Transactional
    public ExperienceBookingResponse createBooking(CreateExperienceBookingRequest request, UUID customerId) {
        // Validate customer
        User customer = userRepository.findById(customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        // Validate session
        ExperienceSession session = experienceSessionRepository.findById(request.getSessionId())
            .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        // Prevent host from booking their own listing
        if (session.getExperienceListing().getHost().getId().equals(customerId)) {
            throw new BadRequestException("You cannot book your own listing");
        }

        // Validate session status
        if (session.getSessionStatus() != SessionStatus.ACTIVE) {
            throw new BadRequestException("Session is not available for booking");
        }

        // Check capacity
        int bookedParticipants = experienceBookingRepository.countBookedParticipants(request.getSessionId());
        int availableSlots = session.getExperienceListing().getCapacity() - bookedParticipants;

        if (request.getQuantity() > availableSlots) {
            throw new BadRequestException("Not enough available slots. Only " + availableSlots + " slots remaining");
        }

        // Calculate total price
        BigDecimal pricePerPerson = session.getExperienceListing().getBasePrice();
        BigDecimal totalPrice = pricePerPerson.multiply(BigDecimal.valueOf(request.getQuantity()));

        // Create booking
        ExperienceBooking booking = new ExperienceBooking();
        booking.setCustomer(customer);
        booking.setSession(session);
        booking.setQuantity(request.getQuantity());
        booking.setTotalPrice(totalPrice);
        booking.setStatus(BookingStatus.PENDING);
        booking.setIsPaid(false);

        ExperienceBooking savedBooking = experienceBookingRepository.save(booking);

        // Update session booked participants
        int newBookedCount = bookedParticipants + request.getQuantity();
        session.setBookedParticipants(newBookedCount);
        
        // Update session status if fully booked
        if (newBookedCount >= session.getExperienceListing().getCapacity()) {
            session.setSessionStatus(SessionStatus.FULL);
        }
        experienceSessionRepository.save(session);

        // Send notification to host
        ExperienceBookingResponse bookingResponse = convertToResponse(savedBooking);
        sendBookingNotificationToHost(session.getExperienceListing(), bookingResponse);
        
        return bookingResponse;
    }
    
    private void sendBookingNotificationToHost(ExperienceListing listing, ExperienceBookingResponse booking) {
        UUID hostId = listing.getHost().getId();
        
        NotificationMessage notification = NotificationMessage.builder()
                .id(UUID.randomUUID())
                .recipientId(hostId)
                .type("BOOKING_EXPERIENCE")
                .title("Đặt trải nghiệm mới!")
                .message(String.format("%s đã đặt '%s' với %d người tham gia",
                        booking.getCustomerName(),
                        listing.getTitle(),
                        booking.getQuantity()))
                .data(booking)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();
        
        notificationService.sendBookingNotificationToHost(hostId, notification);
    }

    @Override
    public ExperienceBookingResponse getBookingById(UUID bookingId) {
        ExperienceBooking booking = experienceBookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return convertToResponse(booking);
    }

    @Override
    public List<ExperienceBookingResponse> getCustomerBookings(UUID customerId) {
        return experienceBookingRepository.findByCustomerId(customerId).stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public List<ExperienceBookingResponse> getSessionBookings(UUID sessionId) {
        return experienceBookingRepository.findBySessionId(sessionId).stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public List<ExperienceBookingResponse> getListingBookings(UUID experienceListingId) {
        return experienceBookingRepository.findByExperienceListingId(experienceListingId).stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    public List<ExperienceBookingResponse> getHostBookings(UUID hostId) {
        return experienceBookingRepository.findByHostId(hostId).stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ExperienceBookingResponse confirmBooking(UUID bookingId, UUID hostId) {
        ExperienceBooking booking = experienceBookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Verify the host owns this listing
        if (!booking.getSession().getExperienceListing().getHost().getId().equals(hostId)) {
            throw new BadRequestException("You can only confirm bookings for your own listings");
        }

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            throw new BadRequestException("Booking is already confirmed");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Cannot confirm a cancelled booking");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        ExperienceBooking savedBooking = experienceBookingRepository.save(booking);
        
        // Send notification to guest
        sendConfirmationNotificationToGuest(savedBooking);
        
        return convertToResponse(savedBooking);
    }
    
    private void sendConfirmationNotificationToGuest(ExperienceBooking booking) {
        UUID guestId = booking.getCustomer().getId();
        
        NotificationMessage notification = NotificationMessage.builder()
                .id(UUID.randomUUID())
                .recipientId(guestId)
                .type("BOOKING_CONFIRMED")
                .title("Đặt trải nghiệm đã được xác nhận!")
                .message(String.format("Đặt trải nghiệm '%s' của bạn đã được xác nhận. Thời gian: %s",
                        booking.getSession().getExperienceListing().getTitle(),
                        booking.getSession().getStartTime().toLocalDate()))
                .data(convertToResponse(booking))
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();
        
        notificationService.sendBookingNotificationToHost(guestId, notification);
    }

    @Override
    @Transactional
    public ExperienceBookingResponse cancelBooking(UUID bookingId, UUID customerId) {
        ExperienceBooking booking = experienceBookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getCustomer().getId().equals(customerId)) {
            throw new BadRequestException("You can only cancel your own bookings");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        ExperienceBooking savedBooking = experienceBookingRepository.save(booking);

        // Update session booked participants
        ExperienceSession session = booking.getSession();
        int newBookedCount = session.getBookedParticipants() - booking.getQuantity();
        session.setBookedParticipants(Math.max(0, newBookedCount));
        
        // Update session status if it was fully booked
        if (session.getSessionStatus() == SessionStatus.FULL) {
            session.setSessionStatus(SessionStatus.ACTIVE);
        }
        experienceSessionRepository.save(session);

        return convertToResponse(savedBooking);
    }

    private ExperienceBookingResponse convertToResponse(ExperienceBooking booking) {
        ExperienceBookingResponse response = new ExperienceBookingResponse();
        response.setId(booking.getId());
        response.setCustomerId(booking.getCustomer().getId());
        
        // Fetch customer name from UserProfile
        String customerName = userProfileRepository.findByUserId(booking.getCustomer().getId())
            .map(UserProfile::getDisplayName)
            .orElse(booking.getCustomer().getUsername());
        response.setCustomerName(customerName);
        
        response.setSessionId(booking.getSession().getId());
        response.setExperienceListingId(booking.getSession().getExperienceListing().getId());
        response.setExperienceListingTitle(booking.getSession().getExperienceListing().getTitle());
        response.setSessionStartTime(booking.getSession().getStartTime());
        response.setSessionEndTime(booking.getSession().getEndTime());
        response.setQuantity(booking.getQuantity());
        response.setTotalPrice(booking.getTotalPrice());
        response.setStatus(booking.getStatus());
        response.setIsPaid(booking.getIsPaid());
        response.setCreatedAt(booking.getCreatedAt());
        return response;
    }
}
