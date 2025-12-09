package octguy.livanabe.controller;

import jakarta.validation.Valid;
import octguy.livanabe.dto.request.CreateFacilityRequest;
import octguy.livanabe.dto.response.FacilityResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.IFacilityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/facilities")
public class FacilityController {

    private final IFacilityService facilityService;

    public FacilityController(IFacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FacilityResponse>>> getAllFacilities() {
        List<FacilityResponse> facilities = facilityService.findAll();

        ApiResponse<List<FacilityResponse>> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Facilities fetched successfully",
                facilities,
                null
        );

        return ResponseEntity.ok().body(apiResponse);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FacilityResponse>> create(@Valid @RequestBody CreateFacilityRequest request) {
        FacilityResponse createdFacility = facilityService.create(request.getName(), request.getIcon());

        ApiResponse<FacilityResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Facility created successfully",
                createdFacility,
                null
        );

        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FacilityResponse>> update(@PathVariable("id") UUID id,
                                                                @Valid @RequestBody CreateFacilityRequest request) {
        FacilityResponse updatedFacility = facilityService.update(id, request.getName(), request.getIcon());

        ApiResponse<FacilityResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Facility updated successfully",
                updatedFacility,
                null
        );

        return ResponseEntity.ok(apiResponse);
    }
}
