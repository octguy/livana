package octguy.livanabe.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import octguy.livanabe.entity.composite_key.UserInterestId;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name="user_interest")
@Setter
@Getter
@Data
public class UserInterest extends BaseEntity {

    @EmbeddedId
    private UserInterestId userInterestId = new UserInterestId();

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name="user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @ManyToOne
    @MapsId("interestId")
    @JoinColumn(name="interest_id", referencedColumnName = "id", nullable = false)
    private Interest interest;
}
