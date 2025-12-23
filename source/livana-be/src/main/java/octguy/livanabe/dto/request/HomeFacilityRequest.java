package octguy.livanabe.dto.request;

import lombok.Data;

import java.util.UUID;

@Data
public class HomeFacilityRequest {

    private UUID facilityId;

    private int quantity;
}
