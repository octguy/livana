package octguy.livanabe.entity;

import jakarta.persistence.*;
import lombok.*;
import octguy.livanabe.enums.MessageType;
import org.hibernate.annotations.SQLRestriction;

import java.util.UUID;

@Entity
@Table(name = "message")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLRestriction("deleted_at IS NULL")
public class Message extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Enumerated(EnumType.STRING)
    @Column(name = "message_type", nullable = false)
    @Builder.Default
    private MessageType messageType = MessageType.TEXT;

    @Column(name = "content", length = 2000)
    private String content;

    @Column(name = "file_url", length = 500)
    private String fileUrl;

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "file_type", length = 100)
    private String fileType;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false;
}
