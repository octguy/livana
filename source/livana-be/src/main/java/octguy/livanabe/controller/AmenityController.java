package octguy.livanabe.controller;

import jakarta.validation.Valid;
import octguy.livanabe.dto.request.CreateAmenityRequest;
import octguy.livanabe.dto.response.AmenityResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.IAmenityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/amenities")
public class AmenityController {

    private final IAmenityService amenityService;

    public AmenityController(IAmenityService amenityService) {
        this.amenityService = amenityService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AmenityResponse>>> getAllAmenities() {
        List<AmenityResponse> amenities = amenityService.findAll();

        ApiResponse<List<AmenityResponse>> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Amenities fetched successfully",
                amenities,
                null
        );

        return ResponseEntity.ok().body(apiResponse);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AmenityResponse>> create(@Valid @RequestBody CreateAmenityRequest request) {
        AmenityResponse createdAmenity = amenityService.create(request.getName(), request.getIcon());

        ApiResponse<AmenityResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Amenity created successfully",
                createdAmenity,
                null
        );

        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AmenityResponse>> update(@PathVariable("id") UUID id,
                                                               @Valid @RequestBody CreateAmenityRequest request) {
        AmenityResponse updatedAmenity = amenityService.update(id, request.getName(), request.getIcon());

        ApiResponse<AmenityResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Amenity updated successfully",
                updatedAmenity,
                null
        );

        return ResponseEntity.ok(apiResponse);
    }
}
