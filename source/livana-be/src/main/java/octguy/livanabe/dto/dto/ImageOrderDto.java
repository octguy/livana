package octguy.livanabe.dto.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ImageOrderDto {

    @JsonProperty("image")
    private String image; // Cloudinary URL from frontend

    @JsonProperty("publicId")
    private String publicId; // Cloudinary public ID from frontend

    @JsonProperty("order")
    private int order;

    // Explicit getter/setter for debugging
    public String getPublicId() {
        return publicId;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }
}
