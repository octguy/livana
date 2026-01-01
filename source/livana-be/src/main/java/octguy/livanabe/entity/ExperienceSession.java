package octguy.livanabe.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import octguy.livanabe.enums.SessionStatus;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name="experience_session")
@Getter
@Setter
@SQLRestriction("deleted_at IS NULL")
public class ExperienceSession extends BaseEntity {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid")
    private UUID id;

    @ManyToOne
    @JoinColumn(name="experience_listing_id", nullable = false)
    private ExperienceListing experienceListing;

    @Column(name="start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name="end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name="booked_participants", nullable = false)
    private int bookedParticipants = 0;

    @Enumerated(EnumType.STRING)
    @Column(name="session_status", nullable = false)
    private SessionStatus sessionStatus;
}

