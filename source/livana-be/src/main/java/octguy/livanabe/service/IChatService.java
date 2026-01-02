package octguy.livanabe.service;

import octguy.livanabe.dto.request.SendMessageRequest;
import octguy.livanabe.dto.response.ConversationResponse;
import octguy.livanabe.dto.response.MessageResponse;

import java.util.List;
import java.util.UUID;

public interface IChatService {

    /**
     * Get or create a conversation between the current user and another user
     */
    ConversationResponse getOrCreateConversation(UUID participantId);

    /**
     * Get all conversations for the current user
     */
    List<ConversationResponse> getConversations();

    /**
     * Get conversation by ID
     */
    ConversationResponse getConversationById(UUID conversationId);

    /**
     * Get messages in a conversation
     */
    List<MessageResponse> getMessages(UUID conversationId);

    /**
     * Get messages in a conversation with pagination
     */
    List<MessageResponse> getMessages(UUID conversationId, int page, int size);

    /**
     * Send a message to a user (creates conversation if needed)
     */
    MessageResponse sendMessage(SendMessageRequest request);

    /**
     * Mark messages as read in a conversation
     */
    void markMessagesAsRead(UUID conversationId);

    /**
     * Get total unread message count for current user
     */
    long getUnreadMessageCount();

    /**
     * Get unread count for a specific conversation
     */
    long getUnreadCountForConversation(UUID conversationId);
}
