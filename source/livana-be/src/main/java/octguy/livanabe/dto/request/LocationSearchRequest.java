package octguy.livanabe.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LocationSearchRequest {
    
    @NotNull(message = "Latitude is required")
    @Min(value = -90, message = "Latitude must be between -90 and 90")
    @Max(value = 90, message = "Latitude must be between -90 and 90")
    private Double latitude;
    
    @NotNull(message = "Longitude is required")
    @Min(value = -180, message = "Longitude must be between -180 and 180")
    @Max(value = 180, message = "Longitude must be between -180 and 180")
    private Double longitude;
    
    @Min(value = 1, message = "Radius must be at least 1 km")
    @Max(value = 500, message = "Radius cannot exceed 500 km")
    private Double radiusKm = 50.0; // Default 50km radius
    
    // Optional filters
    private Double minPrice;
    private Double maxPrice;
    private Integer minCapacity;
    private String propertyTypeId;
    private String experienceCategoryId;
}
