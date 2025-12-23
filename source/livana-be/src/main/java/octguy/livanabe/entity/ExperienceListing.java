package octguy.livanabe.entity;

import jakarta.persistence.*;

@Entity
@Table(name="experience_listing")
public class ExperienceListing extends BaseListing {

    @Column(name="duration_hours", nullable = false)
    private int durationHours;

    @OneToOne
    @JoinColumn(name="experience_category_id", referencedColumnName = "id", nullable = false)
    private ExperienceCategory experienceCategory;
}
