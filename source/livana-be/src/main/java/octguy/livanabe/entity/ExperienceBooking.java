package octguy.livanabe.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="experience_booking")
public class ExperienceBooking extends Booking {

    @ManyToOne
    @JoinColumn(name="session_id", referencedColumnName = "id", nullable = false)
    private ExperienceSession session;

    @Column(name="quantity")
    private int quantity;
}
