package octguy.livanabe.controller;

import jakarta.validation.Valid;
import octguy.livanabe.dto.request.CreateHomeListingRequest;
import octguy.livanabe.dto.response.HomeListingResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.IHomeListingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
