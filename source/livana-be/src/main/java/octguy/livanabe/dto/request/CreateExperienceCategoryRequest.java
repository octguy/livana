package octguy.livanabe.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateExperienceCategoryRequest {

    @NotBlank(message = "Property type name is required")
    private String name;

    @NotBlank(message = "Icon is required")
    private String icon;
}
