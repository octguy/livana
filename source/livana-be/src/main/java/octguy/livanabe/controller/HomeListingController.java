package octguy.livanabe.controller;

import jakarta.validation.Valid;
import octguy.livanabe.dto.request.CreateHomeListingRequest;
import octguy.livanabe.dto.request.LocationSearchRequest;
import octguy.livanabe.dto.request.UpdateHomeListingRequest;
import octguy.livanabe.dto.response.HomeListingResponse;
import octguy.livanabe.dto.response.ListingSearchResult;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.IHomeListingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<HomeListingResponse>> updateHomeListing(
            @PathVariable UUID id,
            @Valid @ModelAttribute UpdateHomeListingRequest request
    ) {
        HomeListingResponse homeListing = homeListingService.updateHomeListing(id, request);

        ApiResponse<HomeListingResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Home listing updated successfully",
                homeListing,
                null
        );

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ListingSearchResult<HomeListingResponse>>>> searchByLocation(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(required = false, defaultValue = "50") Double radiusKm,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String propertyTypeId
    ) {
        LocationSearchRequest request = new LocationSearchRequest();
        request.setLatitude(latitude);
        request.setLongitude(longitude);
        request.setRadiusKm(radiusKm);
        request.setMinPrice(minPrice);
        request.setMaxPrice(maxPrice);
        request.setMinCapacity(minCapacity);
        request.setPropertyTypeId(propertyTypeId);
        
        List<ListingSearchResult<HomeListingResponse>> results = homeListingService.searchByLocation(request);

        ApiResponse<List<ListingSearchResult<HomeListingResponse>>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Home listings search completed successfully",
                results,
                null
        );

        return ResponseEntity.ok(response);
    }
    
    // ==================== Admin Endpoints ====================
    
    @GetMapping("/admin/paginated")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<HomeListingResponse>>> getAllHomeListingsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<HomeListingResponse> homeListings = homeListingService.getAllHomeListingsPaginated(pageable);

        ApiResponse<Page<HomeListingResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Home listings retrieved successfully",
                homeListings,
                null
        );

        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteHomeListing(@PathVariable UUID id) {
        homeListingService.deleteHomeListing(id);

        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.OK,
                "Home listing deleted successfully",
                null,
                null
        );

        return ResponseEntity.ok(response);
    }
}
