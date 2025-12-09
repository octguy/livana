package octguy.livanabe.controller;

import jakarta.validation.Valid;
import octguy.livanabe.dto.request.CreatePropertyTypeRequest;
import octguy.livanabe.dto.response.PropertyTypeResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.IPropertyTypeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/property-types")
public class PropertyTypeController {

    private final IPropertyTypeService propertyTypeService;

    public PropertyTypeController(IPropertyTypeService propertyTypeService) {
        this.propertyTypeService = propertyTypeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PropertyTypeResponse>>> getAllPropertyTypes() {
        List<PropertyTypeResponse> propertyTypes = propertyTypeService.findAll();

        ApiResponse<List<PropertyTypeResponse>> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Property types fetched successfully",
                propertyTypes,
                null
        );

        return ResponseEntity.ok().body(apiResponse);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PropertyTypeResponse>> create(@Valid @RequestBody CreatePropertyTypeRequest request) {
        PropertyTypeResponse createdPropertyType = propertyTypeService.create(request.getName(), request.getIcon());

        ApiResponse<PropertyTypeResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Property type created successfully",
                createdPropertyType,
                null
        );

        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyTypeResponse>> update(@PathVariable("id") UUID id,
                                                                    @Valid @RequestBody CreatePropertyTypeRequest request) {
        PropertyTypeResponse updatedPropertyType = propertyTypeService.update(id, request.getName(), request.getIcon());

        ApiResponse<PropertyTypeResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Property type updated successfully",
                updatedPropertyType,
                null
        );

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}/soft")
    public ResponseEntity<ApiResponse<Void>> softDelete(@PathVariable("id") UUID id) {
        propertyTypeService.softDelete(id);

        ApiResponse<Void> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Property type soft deleted successfully",
                null,
                null
        );

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}/hard")
    public ResponseEntity<ApiResponse<Void>> hardDelete(@PathVariable("id") UUID id) {
        propertyTypeService.hardDelete(id);

        ApiResponse<Void> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Property type hard deleted successfully",
                null,
                null
        );

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/soft/all")
    public ResponseEntity<ApiResponse<Void>> softDeleteAll() {
        propertyTypeService.softDeleteAll();

        ApiResponse<Void> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "All property types soft deleted successfully",
                null,
                null
        );

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/hard/all")
    public ResponseEntity<ApiResponse<Void>> hardDeleteAll() {
        propertyTypeService.hardDeleteAll();

        ApiResponse<Void> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "All property types hard deleted successfully",
                null,
                null
        );

        return ResponseEntity.ok(apiResponse);
    }
}
