package octguy.livanabe.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InterestResponse {

    private String name;

    private String icon;
}
