package octguy.livanabe.controller;

import jakarta.validation.Valid;
import octguy.livanabe.dto.request.CreateExperienceListingRequest;
import octguy.livanabe.dto.request.UpdateExperienceListingRequest;
import octguy.livanabe.dto.response.ExperienceListingResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.IExperienceListingService;
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
}
