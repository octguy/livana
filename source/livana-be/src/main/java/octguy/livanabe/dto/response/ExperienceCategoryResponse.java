package octguy.livanabe.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ExperienceCategoryResponse {

    private UUID id;

    private String name;
}
