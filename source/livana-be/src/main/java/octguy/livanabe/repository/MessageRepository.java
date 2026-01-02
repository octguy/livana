package octguy.livanabe.repository;

import octguy.livanabe.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

    /**
     * Find all messages in a conversation, ordered by creation time (with sender eagerly fetched)
     */
    @Query("SELECT m FROM Message m LEFT JOIN FETCH m.sender LEFT JOIN FETCH m.conversation WHERE m.conversation.id = :conversationId ORDER BY m.createdAt ASC")
    List<Message> findByConversationIdOrderByCreatedAtAsc(@Param("conversationId") UUID conversationId);

    /**
     * Find messages in a conversation with pagination (with sender eagerly fetched)
     */
    @Query("SELECT m FROM Message m LEFT JOIN FETCH m.sender LEFT JOIN FETCH m.conversation WHERE m.conversation.id = :conversationId ORDER BY m.createdAt DESC")
    List<Message> findByConversationIdWithSenderOrderByCreatedAtDesc(@Param("conversationId") UUID conversationId, Pageable pageable);

    /**
     * Count unread messages in a conversation for a specific user
     */
    @Query("SELECT COUNT(m) FROM Message m WHERE m.conversation.id = :conversationId AND m.sender.id != :userId AND m.isRead = false")
    long countUnreadByConversationIdAndUserId(@Param("conversationId") UUID conversationId, @Param("userId") UUID userId);

    /**
     * Count total unread messages for a user across all conversations
     */
    @Query("SELECT COUNT(m) FROM Message m WHERE (m.conversation.user1.id = :userId OR m.conversation.user2.id = :userId) AND m.sender.id != :userId AND m.isRead = false")
    long countTotalUnreadByUserId(@Param("userId") UUID userId);

    /**
     * Mark all messages as read in a conversation for a specific user (messages not sent by them)
     */
    @Modifying
    @Query("UPDATE Message m SET m.isRead = true WHERE m.conversation.id = :conversationId AND m.sender.id != :userId AND m.isRead = false")
    void markAsReadByConversationIdAndUserId(@Param("conversationId") UUID conversationId, @Param("userId") UUID userId);

    /**
     * Get the latest message in a conversation
     */
    @Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId ORDER BY m.createdAt DESC LIMIT 1")
    Message findLatestByConversationId(@Param("conversationId") UUID conversationId);
}
