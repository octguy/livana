package octguy.livanabe.dto.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ListingHostDto {

    private UUID hostId;

    private String hostDisplayName;

    private String avatarUrl;

    private String phoneNumber;
}
