package octguy.livanabe.service;

import octguy.livanabe.dto.request.CreateHomeBookingRequest;
import octguy.livanabe.dto.response.HomeBookingResponse;

import java.util.List;
import java.util.UUID;

public interface IHomeBookingService {
    
    HomeBookingResponse createBooking(CreateHomeBookingRequest request, UUID customerId);
    
    HomeBookingResponse getBookingById(UUID bookingId);
    
    List<HomeBookingResponse> getCustomerBookings(UUID customerId);
    
    List<HomeBookingResponse> getListingBookings(UUID homeListingId);
    
    List<HomeBookingResponse> getHostBookings(UUID hostId);
    
    HomeBookingResponse confirmBooking(UUID bookingId, UUID hostId);
    
    HomeBookingResponse cancelBooking(UUID bookingId, UUID customerId);
}
