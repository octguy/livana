package octguy.livanabe.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="experience_listing")
@Getter
@Setter
public class ExperienceListing extends BaseListing {

    @ManyToOne
    @JoinColumn(name="experience_category_id", referencedColumnName = "id", nullable = false)
    private ExperienceCategory experienceCategory;
}
