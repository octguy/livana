package octguy.livanabe.controller;

import jakarta.validation.Valid;
import octguy.livanabe.dto.request.CreateExperienceListingRequest;
import octguy.livanabe.dto.request.LocationSearchRequest;
import octguy.livanabe.dto.request.UpdateExperienceListingRequest;
import octguy.livanabe.dto.response.ExperienceListingResponse;
import octguy.livanabe.dto.response.ListingSearchResult;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.IExperienceListingService;
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
@RequestMapping("/api/v1/listings/experiences")
public class ExperienceListingController {

    private final IExperienceListingService experienceListingService;

    public ExperienceListingController(IExperienceListingService experienceListingService) {
        this.experienceListingService = experienceListingService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ExperienceListingResponse>> createExperienceListing(
            @Valid @ModelAttribute CreateExperienceListingRequest request
    ) {
        ExperienceListingResponse experienceListing = experienceListingService.createExperienceListing(request);

        ApiResponse<ExperienceListingResponse> response = new ApiResponse<>(
                HttpStatus.CREATED,
                "Experience listing created successfully",
                experienceListing,
                null
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExperienceListingResponse>>> getAllExperienceListings() {
        List<ExperienceListingResponse> listings = experienceListingService.getAllExperienceListings();

        ApiResponse<List<ExperienceListingResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Experience listings retrieved successfully",
                listings,
                null
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExperienceListingResponse>> getExperienceListingById(
            @PathVariable UUID id
    ) {
        ExperienceListingResponse listing = experienceListingService.getExperienceListingById(id);

        ApiResponse<ExperienceListingResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Experience listing retrieved successfully",
                listing,
                null
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/host/{hostId}")
    public ResponseEntity<ApiResponse<List<ExperienceListingResponse>>> getExperienceListingsByHostId(
            @PathVariable UUID hostId
    ) {
        List<ExperienceListingResponse> listings = experienceListingService.getExperienceListingsByHostId(hostId);

        ApiResponse<List<ExperienceListingResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Experience listings for host retrieved successfully",
                listings,
                null
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ExperienceListingResponse>> updateExperienceListing(
            @PathVariable UUID id,
            @Valid @ModelAttribute UpdateExperienceListingRequest request
    ) {
        ExperienceListingResponse listing = experienceListingService.updateExperienceListing(id, request);

        ApiResponse<ExperienceListingResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Experience listing updated successfully",
                listing,
                null
        );

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ListingSearchResult<ExperienceListingResponse>>>> searchByLocation(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(required = false, defaultValue = "50") Double radiusKm,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String experienceCategoryId
    ) {
        LocationSearchRequest request = new LocationSearchRequest();
        request.setLatitude(latitude);
        request.setLongitude(longitude);
        request.setRadiusKm(radiusKm);
        request.setMinPrice(minPrice);
        request.setMaxPrice(maxPrice);
        request.setMinCapacity(minCapacity);
        request.setExperienceCategoryId(experienceCategoryId);
        
        List<ListingSearchResult<ExperienceListingResponse>> results = experienceListingService.searchByLocation(request);

        ApiResponse<List<ListingSearchResult<ExperienceListingResponse>>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Experience listings search completed successfully",
                results,
                null
        );

        return ResponseEntity.ok(response);
    }
    
    // ==================== Admin Endpoints ====================
    
    @GetMapping("/admin/paginated")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<ExperienceListingResponse>>> getAllExperienceListingsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<ExperienceListingResponse> listings = experienceListingService.getAllExperienceListingsPaginated(pageable);

        ApiResponse<Page<ExperienceListingResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Experience listings retrieved successfully",
                listings,
                null
        );

        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteExperienceListing(@PathVariable UUID id) {
        experienceListingService.deleteExperienceListing(id);

        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.OK,
                "Experience listing deleted successfully",
                null,
                null
        );

        return ResponseEntity.ok(response);
    }
}
