package octguy.livanabe.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePropertyTypeRequest {

    @NotBlank(message = "Property type name is required")
    @Size(max = 15, message = "Property type name must not exceed 15 characters")
    private String name;

    @NotBlank(message = "Icon is required")
    @Size(min = 1, max = 1, message = "Icon must be a single character")
    private String icon;
}
