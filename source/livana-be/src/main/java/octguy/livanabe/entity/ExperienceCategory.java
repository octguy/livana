package octguy.livanabe.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name="experience_category")
@Getter
@Setter
@SQLRestriction("deleted_at IS NULL")
public class ExperienceCategory extends BaseEntity {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = true)
    private String icon;
}
