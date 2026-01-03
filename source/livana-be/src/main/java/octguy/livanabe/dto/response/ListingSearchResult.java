package octguy.livanabe.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ListingSearchResult<T> {
    private T listing;
    private Double distanceKm;
}
