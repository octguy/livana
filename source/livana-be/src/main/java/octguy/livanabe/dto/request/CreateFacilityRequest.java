package octguy.livanabe.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateFacilityRequest {

    @NotBlank(message = "Facility name is required")
    @Size(max = 100, message = "Facility name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Icon is required")
    @Size(min = 1, max = 1, message = "Icon must be a single character")
    private String icon;
}
