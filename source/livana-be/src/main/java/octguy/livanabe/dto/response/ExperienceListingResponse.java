package octguy.livanabe.dto.response;

import lombok.Builder;
import lombok.Data;
import octguy.livanabe.dto.dto.ImageOrderResponse;
import octguy.livanabe.dto.dto.ListingHostDto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ExperienceListingResponse {

    private UUID listingId;

    private ListingHostDto host;

    private String title;

    private BigDecimal price;

    private String description;

    private int capacity;

    private String address;

    private Double latitude;

    private Double longitude;

    private ExperienceCategoryResponse experienceCategory;

    private List<ImageOrderResponse> images;
}
