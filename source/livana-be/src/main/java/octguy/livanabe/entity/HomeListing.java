package octguy.livanabe.entity;

import jakarta.persistence.*;

@Entity
@Table(name="home_listing")
public class HomeListing extends BaseListing {

    @OneToOne
    @JoinColumn(name="property_type_id", referencedColumnName = "id", nullable = false)
    private PropertyType propertyType;
}
