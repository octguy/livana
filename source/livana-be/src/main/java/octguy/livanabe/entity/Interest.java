package octguy.livanabe.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name="interest")
@Getter
@Setter
@SQLRestriction("deleted_at IS NULL")
public class Interest extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name="key", unique = true, nullable = false, length = 50)
    private String key;

    @Column(name="name", nullable = false, length = 100)
    private String name;

    @Column(name="icon", nullable = false, length = 1, columnDefinition = "text")
    private String icon;

    @OneToMany(mappedBy = "interest", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserInterest> userInterests = new HashSet<>();
}
