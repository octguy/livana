package octguy.livanabe.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import octguy.livanabe.dto.request.CreateHomeBookingRequest;
import octguy.livanabe.dto.response.HomeBookingResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.IHomeBookingService;
import octguy.livanabe.utils.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/home-bookings")
@RequiredArgsConstructor
public class HomeBookingController {

    private final IHomeBookingService homeBookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<HomeBookingResponse>> createBooking(
        @Valid @RequestBody CreateHomeBookingRequest request
    ) {
        UUID customerId = SecurityUtils.getCurrentUser().getId();
        HomeBookingResponse booking = homeBookingService.createBooking(request, customerId);
        
        ApiResponse<HomeBookingResponse> response = new ApiResponse<>(
                HttpStatus.CREATED,
                "Booking created successfully",
                booking,
                null
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HomeBookingResponse>> getBooking(@PathVariable UUID id) {
        HomeBookingResponse booking = homeBookingService.getBookingById(id);
        
        ApiResponse<HomeBookingResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Booking retrieved successfully",
                booking,
                null
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<List<HomeBookingResponse>>> getMyBookings() {
        UUID customerId = SecurityUtils.getCurrentUser().getId();
        List<HomeBookingResponse> bookings = homeBookingService.getCustomerBookings(customerId);
        
        ApiResponse<List<HomeBookingResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Bookings retrieved successfully",
                bookings,
                null
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/listing/{listingId}")
    public ResponseEntity<ApiResponse<List<HomeBookingResponse>>> getListingBookings(@PathVariable UUID listingId) {
        List<HomeBookingResponse> bookings = homeBookingService.getListingBookings(listingId);
        
        ApiResponse<List<HomeBookingResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Listing bookings retrieved successfully",
                bookings,
                null
        );
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<HomeBookingResponse>> cancelBooking(
        @PathVariable UUID id
    ) {
        UUID customerId = SecurityUtils.getCurrentUser().getId();
        HomeBookingResponse booking = homeBookingService.cancelBooking(id, customerId);
        
        ApiResponse<HomeBookingResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Booking cancelled successfully",
                booking,
                null
        );
        
        return ResponseEntity.ok(response);
    }
}
