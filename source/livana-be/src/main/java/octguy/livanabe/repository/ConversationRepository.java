package octguy.livanabe.repository;

import octguy.livanabe.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {

    /**
     * Find conversation by ID with users eagerly fetched
     */
    @Query("SELECT c FROM Conversation c LEFT JOIN FETCH c.user1 LEFT JOIN FETCH c.user2 WHERE c.id = :id")
    Optional<Conversation> findByIdWithUsers(@Param("id") UUID id);

    /**
     * Find all conversations for a user (as either user1 or user2)
     */
    @Query("SELECT c FROM Conversation c LEFT JOIN FETCH c.user1 LEFT JOIN FETCH c.user2 WHERE c.user1.id = :userId OR c.user2.id = :userId ORDER BY c.lastMessageAt DESC NULLS LAST")
    List<Conversation> findByUserId(@Param("userId") UUID userId);

    /**
     * Find conversation between two users (regardless of order)
     */
    @Query("SELECT c FROM Conversation c LEFT JOIN FETCH c.user1 LEFT JOIN FETCH c.user2 WHERE (c.user1.id = :userId1 AND c.user2.id = :userId2) OR (c.user1.id = :userId2 AND c.user2.id = :userId1)")
    Optional<Conversation> findByUserIds(@Param("userId1") UUID userId1, @Param("userId2") UUID userId2);

    /**
     * Check if conversation exists between two users
     */
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Conversation c WHERE (c.user1.id = :userId1 AND c.user2.id = :userId2) OR (c.user1.id = :userId2 AND c.user2.id = :userId1)")
    boolean existsByUserIds(@Param("userId1") UUID userId1, @Param("userId2") UUID userId2);
}
