package octguy.livanabe.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateInterestRequest {

    @NotBlank(message = "Interest name is required")
    @Pattern(regexp = "^[A-Za-z]+\\s+[A-Za-z]+$", message = "Name must contain exactly two words")
    private String name;

    @NotBlank(message = "Icon is required")
    @Size(min = 1, max = 1, message = "Icon must be a single character")
    private String icon;
}
