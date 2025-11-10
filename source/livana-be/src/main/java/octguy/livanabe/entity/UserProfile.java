package octguy.livanabe.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

import java.util.UUID;

@Entity
@Table(name="user_profile")
@Getter
@Setter
@SQLRestriction("deleted_at IS NULL")
public class UserProfile extends BaseEntity {

    @Id
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(name="display_name", length = 100, nullable = false)
    private String displayName;

    @Column(name="phone_number", length = 15)
    private String phoneNumber;

    @Column(name="bio", length = 500)
    private String bio;

    @Column(name="avatar_url", length = 200)
    private String avatarUrl;
}
