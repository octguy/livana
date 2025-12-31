package octguy.livanabe.service;

import octguy.livanabe.dto.request.CreateExperienceBookingRequest;
import octguy.livanabe.dto.response.ExperienceBookingResponse;

import java.util.List;
import java.util.UUID;

public interface IExperienceBookingService {
    
    ExperienceBookingResponse createBooking(CreateExperienceBookingRequest request, UUID customerId);
    
    ExperienceBookingResponse getBookingById(UUID bookingId);
    
    List<ExperienceBookingResponse> getCustomerBookings(UUID customerId);
    
    List<ExperienceBookingResponse> getSessionBookings(UUID sessionId);
    
    List<ExperienceBookingResponse> getListingBookings(UUID experienceListingId);
    
    List<ExperienceBookingResponse> getHostBookings(UUID hostId);
    
    ExperienceBookingResponse cancelBooking(UUID bookingId, UUID customerId);
}
