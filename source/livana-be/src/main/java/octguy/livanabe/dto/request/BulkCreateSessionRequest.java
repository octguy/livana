package octguy.livanabe.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class BulkCreateSessionRequest {

    @NotEmpty(message = "Sessions list must not be empty")
    @Valid
    private List<CreateSessionRequest> sessions;
}
