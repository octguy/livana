package octguy.livanabe.dto.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class FacilityQuantityDto {

    private int quantity;

    private UUID facilityId;
}
