package octguy.livanabe.dto.dto;

import lombok.Builder;
import lombok.Data;
import octguy.livanabe.dto.response.CloudinaryResponse;

@Data
@Builder
public class ImageOrderResponse {

    private CloudinaryResponse image;

    private int order;
}
