package octguy.livanabe.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import octguy.livanabe.enums.UserStatus;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name="\"user\"")
@Getter
@Setter
@SQLRestriction("deleted_at IS NULL")
public class User extends BaseEntity {

    @Id
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name="username", unique = true, nullable = false, length = 50)
    private String username;

    @Column(name="email", unique = true, nullable = false, length = 50)
    private String email;

    @Column(name="enabled", nullable = false)
    private boolean enabled;

    @Enumerated(EnumType.STRING)
    @Column(name="status", nullable = false)
    private UserStatus status;

    @Column(name="last_login_at")
    private LocalDateTime lastLoginAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<RoleUser> roleUsers = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserInterest> userInterests = new HashSet<>();

    public void addRole(Role role) {
        RoleUser roleUser = new RoleUser();
        roleUser.setRole(role);
        roleUser.setUser(this);
        roleUser.setCreatedAt(LocalDateTime.now());
        roleUser.setUpdatedAt(LocalDateTime.now());
        this.roleUsers.add(roleUser);
        // not necessary to set roleUserId here, it will be set automatically (thanks to @MapsId)
        // only if it was initialized, otherwise BUMP  :D
    }

    public void setInterests(Set<Interest> interests) {
        this.userInterests.clear();
        for (Interest interest : interests) {
            UserInterest userInterest = new UserInterest();
            userInterest.setUser(this);
            userInterest.setInterest(interest);
            userInterest.setCreatedAt(LocalDateTime.now());
            userInterest.setUpdatedAt(LocalDateTime.now());
            this.userInterests.add(userInterest);
        }
    }
}
