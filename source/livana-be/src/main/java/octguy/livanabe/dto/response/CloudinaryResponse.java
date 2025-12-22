package octguy.livanabe.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CloudinaryResponse {

    private String url;

    private String publicId;
}
