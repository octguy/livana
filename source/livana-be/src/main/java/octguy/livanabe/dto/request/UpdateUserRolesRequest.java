package octguy.livanabe.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import octguy.livanabe.enums.UserRole;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRolesRequest {
    @NotEmpty(message = "Roles cannot be empty")
    private List<UserRole> roles;
}
