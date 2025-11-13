package octguy.livanabe.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import octguy.livanabe.entity.composite_key.RoleUserId;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name="role_user")
@Setter
@Getter
public class RoleUser extends BaseEntity {

    @EmbeddedId
    private RoleUserId roleUserId = new RoleUserId(); // initialize to avoid NullPointerException

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name="user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @ManyToOne
    @MapsId("roleId")
    @JoinColumn(name="role_id", referencedColumnName = "id", nullable = false)
    private Role role;
}