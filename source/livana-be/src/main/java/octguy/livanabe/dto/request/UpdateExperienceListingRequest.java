package octguy.livanabe.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import octguy.livanabe.dto.dto.ImageOrderDto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class UpdateExperienceListingRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @Min(value = 1, message = "Price must be greater than 0")
    private BigDecimal price;

    private String description;

    private int capacity;

    private String address;

    private Double latitude;

    private Double longitude;

    private UUID experienceCategoryId;

    private List<ImageOrderDto> images;
}
