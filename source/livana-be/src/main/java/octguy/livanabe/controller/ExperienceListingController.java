package octguy.livanabe.controller;

import jakarta.validation.Valid;
import octguy.livanabe.dto.request.CreateExperienceListingRequest;
import octguy.livanabe.dto.response.ExperienceListingResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.IExperienceListingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
}
