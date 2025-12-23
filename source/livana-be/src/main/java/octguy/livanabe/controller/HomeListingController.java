package octguy.livanabe.controller;

import jakarta.validation.Valid;
import octguy.livanabe.dto.request.CreateHomeListingRequest;
import octguy.livanabe.dto.response.HomeListingResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.IHomeListingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/listings/homes")
public class HomeListingController {

    private final IHomeListingService homeListingService;

    public HomeListingController(IHomeListingService homeListingService) {
        this.homeListingService = homeListingService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<HomeListingResponse>> createHomeListing(
            @Valid @ModelAttribute CreateHomeListingRequest request
    ) {
        HomeListingResponse homeListing = homeListingService.createHomeListing(request);

        ApiResponse<HomeListingResponse> response = new ApiResponse<>(
                HttpStatus.CREATED,
                "Home listing created successfully",
                homeListing,
                null
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HomeListingResponse>>> getAllHomeListings() {
        List<HomeListingResponse> homeListings = homeListingService.getAllHomeListings();

        ApiResponse<List<HomeListingResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Home listings retrieved successfully",
                homeListings,
                null
        );

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HomeListingResponse>> getHomeListingById(@PathVariable UUID id) {
        HomeListingResponse homeListing = homeListingService.getHomeListingById(id);

        ApiResponse<HomeListingResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Home listing retrieved successfully",
                homeListing,
                null
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/host/{hostId}")
    public ResponseEntity<ApiResponse<List<HomeListingResponse>>> getHomeListingsByHostId(@PathVariable UUID hostId) {
        List<HomeListingResponse> homeListings = homeListingService.getHomeListingsByHostId(hostId);

        ApiResponse<List<HomeListingResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Host's home listings retrieved successfully",
                homeListings,
                null
        );

        return ResponseEntity.ok(response);
    }
}
