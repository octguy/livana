package octguy.livanabe.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class InterestResponse {

    private UUID id;

    private String key;

    private String name;

    private String icon;
}
