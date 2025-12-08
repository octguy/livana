package octguy.livanabe.controller;

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
    public ResponseEntity<ApiResponse<PropertyTypeResponse>> create(@RequestParam String name) {
        PropertyTypeResponse createdPropertyType = propertyTypeService.create(name);

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
                                                                    @RequestParam String name) {
        PropertyTypeResponse updatedPropertyType = propertyTypeService.update(id, name);

        ApiResponse<PropertyTypeResponse> apiResponse = new ApiResponse<>(
                HttpStatus.OK,
                "Property type updated successfully",
                updatedPropertyType,
                null
        );

        return ResponseEntity.ok(apiResponse);
    }
}
