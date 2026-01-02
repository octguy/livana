package octguy.livanabe.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "conversation", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user1_id", "user2_id"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLRestriction("deleted_at IS NULL")
public class Conversation extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;

    @Column(name = "last_message_content", length = 500)
    private String lastMessageContent;

    @Column(name = "last_message_at")
    private java.time.LocalDateTime lastMessageAt;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt ASC")
    @Builder.Default
    private List<Message> messages = new ArrayList<>();

    /**
     * Check if a user is part of this conversation
     */
    public boolean hasParticipant(UUID userId) {
        return (user1 != null && user1.getId().equals(userId)) ||
               (user2 != null && user2.getId().equals(userId));
    }

    /**
     * Get the other participant in the conversation
     */
    public User getOtherParticipant(UUID userId) {
        if (user1 != null && user1.getId().equals(userId)) {
            return user2;
        }
        return user1;
    }
}
