package octguy.livanabe.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import octguy.livanabe.enums.UserStatus;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

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
        // Build map of existing interest id -> UserInterest
        Map<UUID, UserInterest> existing = this.userInterests.stream()
                .filter(ui -> ui.getInterest() != null && ui.getInterest().getId() != null)
                .collect(Collectors.toMap(ui -> ui.getInterest().getId(), ui -> ui));

        Set<UUID> newIds = interests.stream()
                .map(Interest::getId)
                .collect(Collectors.toSet());

        // Remove entries that are not in the new set
        Iterator<UserInterest> it = this.userInterests.iterator();
        while (it.hasNext()) {
            UserInterest ui = it.next();
            UUID iid = ui.getInterest() != null ? ui.getInterest().getId() : null;
            if (iid == null || !newIds.contains(iid)) {
                it.remove();
            }
        }

        // Add only new UserInterest objects for interests that don't already exist
        for (Interest interest : interests) {
            UUID iid = interest.getId();
            if (iid == null) {
                continue;
            }
            if (!existing.containsKey(iid)) {
                UserInterest userInterest = new UserInterest();
                userInterest.setUser(this);
                userInterest.setInterest(interest);
                userInterest.setCreatedAt(LocalDateTime.now());
                userInterest.setUpdatedAt(LocalDateTime.now());
                this.userInterests.add(userInterest);
            }
        }
    }
}
