package octguy.livanabe.dto.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ImageOrderDto {

    private MultipartFile image;

    private int order;
}
