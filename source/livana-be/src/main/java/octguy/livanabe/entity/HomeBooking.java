package octguy.livanabe.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name="home_booking")
public class HomeBooking extends Booking {

    @ManyToOne
    @JoinColumn(name="home_listing_id", referencedColumnName = "id", nullable = false)
    private HomeListing homeListing;

    @Column(name="check_in_time", nullable = false)
    private LocalDateTime checkInTime;

    @Column(name="check_out_time", nullable = false)
    private LocalDateTime checkOutTime;

    @Column(name="guests", nullable = false)
    private int guests;
}
