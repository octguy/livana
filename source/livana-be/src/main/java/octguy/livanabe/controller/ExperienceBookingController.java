package octguy.livanabe.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import octguy.livanabe.dto.request.CreateExperienceBookingRequest;
import octguy.livanabe.dto.response.ExperienceBookingResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.IExperienceBookingService;
import octguy.livanabe.utils.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/experience-bookings")
@RequiredArgsConstructor
public class ExperienceBookingController {

    private final IExperienceBookingService experienceBookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<ExperienceBookingResponse>> createBooking(
        @Valid @RequestBody CreateExperienceBookingRequest request
    ) {
        UUID customerId = SecurityUtils.getCurrentUser().getId();
        ExperienceBookingResponse booking = experienceBookingService.createBooking(request, customerId);
        
        ApiResponse<ExperienceBookingResponse> response = new ApiResponse<>(
                HttpStatus.CREATED,
                "Booking created successfully",
                booking,
                null
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExperienceBookingResponse>> getBooking(@PathVariable UUID id) {
        ExperienceBookingResponse booking = experienceBookingService.getBookingById(id);
        
        ApiResponse<ExperienceBookingResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Booking retrieved successfully",
                booking,
                null
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<List<ExperienceBookingResponse>>> getMyBookings() {
        UUID customerId = SecurityUtils.getCurrentUser().getId();
        List<ExperienceBookingResponse> bookings = experienceBookingService.getCustomerBookings(customerId);
        
        ApiResponse<List<ExperienceBookingResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Bookings retrieved successfully",
                bookings,
                null
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<ApiResponse<List<ExperienceBookingResponse>>> getSessionBookings(@PathVariable UUID sessionId) {
        List<ExperienceBookingResponse> bookings = experienceBookingService.getSessionBookings(sessionId);
        
        ApiResponse<List<ExperienceBookingResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Session bookings retrieved successfully",
                bookings,
                null
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/listing/{listingId}")
    public ResponseEntity<ApiResponse<List<ExperienceBookingResponse>>> getListingBookings(@PathVariable UUID listingId) {
        List<ExperienceBookingResponse> bookings = experienceBookingService.getListingBookings(listingId);
        
        ApiResponse<List<ExperienceBookingResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Listing bookings retrieved successfully",
                bookings,
                null
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/host-bookings")
    public ResponseEntity<ApiResponse<List<ExperienceBookingResponse>>> getHostBookings() {
        UUID hostId = SecurityUtils.getCurrentUser().getId();
        List<ExperienceBookingResponse> bookings = experienceBookingService.getHostBookings(hostId);
        
        ApiResponse<List<ExperienceBookingResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Host bookings retrieved successfully",
                bookings,
                null
        );
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<ExperienceBookingResponse>> cancelBooking(
        @PathVariable UUID id
    ) {
        UUID customerId = SecurityUtils.getCurrentUser().getId();
        ExperienceBookingResponse booking = experienceBookingService.cancelBooking(id, customerId);
        
        ApiResponse<ExperienceBookingResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Booking cancelled successfully",
                booking,
                null
        );
        
        return ResponseEntity.ok(response);
    }
}
