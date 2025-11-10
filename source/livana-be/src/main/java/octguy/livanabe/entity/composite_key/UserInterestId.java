package octguy.livanabe.entity.composite_key;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Getter
@Setter
public class UserInterestId implements Serializable {

    @Column(name="user_id", columnDefinition = "uuid")
    private UUID userId;

    @Column(name="interest_id", columnDefinition = "uuid")
    private UUID interestId;
}
