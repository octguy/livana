package octguy.livanabe.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SetInterestRequest {

//    @NotEmpty(message = "Interest IDs must not be blank")
    private List<UUID> interestIds;
}
