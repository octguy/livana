package octguy.livanabe.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import octguy.livanabe.dto.request.CreateConversationRequest;
import octguy.livanabe.dto.request.SendMessageRequest;
import octguy.livanabe.dto.response.ConversationResponse;
import octguy.livanabe.dto.response.MessageResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.IChatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final IChatService chatService;

    /**
     * Get or create a conversation with another user
     */
    @PostMapping("/conversations")
    public ResponseEntity<ApiResponse<ConversationResponse>> getOrCreateConversation(
            @Valid @RequestBody CreateConversationRequest request
    ) {
        ConversationResponse conversation = chatService.getOrCreateConversation(request.getParticipantId());

        ApiResponse<ConversationResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Conversation retrieved successfully",
                conversation,
                null
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Get all conversations for the current user
     */
    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<ConversationResponse>>> getConversations() {
        List<ConversationResponse> conversations = chatService.getConversations();

        ApiResponse<List<ConversationResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Conversations retrieved successfully",
                conversations,
                null
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Get a specific conversation by ID
     */
    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<ApiResponse<ConversationResponse>> getConversationById(
            @PathVariable UUID conversationId
    ) {
        ConversationResponse conversation = chatService.getConversationById(conversationId);

        ApiResponse<ConversationResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Conversation retrieved successfully",
                conversation,
                null
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Get messages in a conversation
     */
    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<ApiResponse<List<MessageResponse>>> getMessages(
            @PathVariable UUID conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        List<MessageResponse> messages = chatService.getMessages(conversationId, page, size);

        ApiResponse<List<MessageResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Messages retrieved successfully",
                messages,
                null
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Send a message to a user
     */
    @PostMapping("/messages")
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(
            @Valid @RequestBody SendMessageRequest request
    ) {
        MessageResponse message = chatService.sendMessage(request);

        ApiResponse<MessageResponse> response = new ApiResponse<>(
                HttpStatus.CREATED,
                "Message sent successfully",
                message,
                null
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Mark messages as read in a conversation
     */
    @PutMapping("/conversations/{conversationId}/read")
    public ResponseEntity<ApiResponse<Void>> markMessagesAsRead(
            @PathVariable UUID conversationId
    ) {
        chatService.markMessagesAsRead(conversationId);

        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.OK,
                "Messages marked as read",
                null,
                null
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Get total unread message count
     */
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        long count = chatService.getUnreadMessageCount();

        ApiResponse<Long> response = new ApiResponse<>(
                HttpStatus.OK,
                "Unread count retrieved successfully",
                count,
                null
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Get unread count for a specific conversation
     */
    @GetMapping("/conversations/{conversationId}/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCountForConversation(
            @PathVariable UUID conversationId
    ) {
        long count = chatService.getUnreadCountForConversation(conversationId);

        ApiResponse<Long> response = new ApiResponse<>(
                HttpStatus.OK,
                "Unread count retrieved successfully",
                count,
                null
        );

        return ResponseEntity.ok(response);
    }
}
