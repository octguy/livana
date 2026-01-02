package octguy.livanabe.service.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import octguy.livanabe.dto.dto.ChatMessageDto;
import octguy.livanabe.dto.request.SendMessageRequest;
import octguy.livanabe.dto.response.ConversationResponse;
import octguy.livanabe.dto.response.MessageResponse;
import octguy.livanabe.entity.Conversation;
import octguy.livanabe.entity.Message;
import octguy.livanabe.entity.User;
import octguy.livanabe.entity.UserProfile;
import octguy.livanabe.enums.MessageType;
import octguy.livanabe.exception.BadRequestException;
import octguy.livanabe.exception.ResourceNotFoundException;
import octguy.livanabe.repository.ConversationRepository;
import octguy.livanabe.repository.MessageRepository;
import octguy.livanabe.repository.UserProfileRepository;
import octguy.livanabe.repository.UserRepository;
import octguy.livanabe.service.IChatService;
import octguy.livanabe.utils.SecurityUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements IChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public ConversationResponse getOrCreateConversation(UUID participantId) {
        UUID currentUserId = SecurityUtils.getCurrentUser().getId();

        if (currentUserId.equals(participantId)) {
            throw new BadRequestException("Cannot create conversation with yourself");
        }

        // Check if conversation already exists
        Optional<Conversation> existingConversation = conversationRepository.findByUserIds(currentUserId, participantId);

        if (existingConversation.isPresent()) {
            return convertToConversationResponse(existingConversation.get(), currentUserId);
        }

        // Create new conversation
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
        User participant = userRepository.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("Participant not found"));

        Conversation conversation = Conversation.builder()
                .user1(currentUser)
                .user2(participant)
                .build();

        Conversation saved = conversationRepository.save(conversation);
        log.info("Created new conversation {} between {} and {}", saved.getId(), currentUserId, participantId);

        return convertToConversationResponse(saved, currentUserId);
    }

    @Override
    public List<ConversationResponse> getConversations() {
        UUID currentUserId = SecurityUtils.getCurrentUser().getId();
        List<Conversation> conversations = conversationRepository.findByUserId(currentUserId);

        return conversations.stream()
                .map(conv -> convertToConversationResponse(conv, currentUserId))
                .collect(Collectors.toList());
    }

    @Override
    public ConversationResponse getConversationById(UUID conversationId) {
        UUID currentUserId = SecurityUtils.getCurrentUser().getId();

        Conversation conversation = conversationRepository.findByIdWithUsers(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        if (!conversation.hasParticipant(currentUserId)) {
            throw new BadRequestException("You are not a participant of this conversation");
        }

        return convertToConversationResponse(conversation, currentUserId);
    }

    @Override
    public List<MessageResponse> getMessages(UUID conversationId) {
        UUID currentUserId = SecurityUtils.getCurrentUser().getId();
        
        Conversation conversation = conversationRepository.findByIdWithUsers(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        if (!conversation.hasParticipant(currentUserId)) {
            throw new BadRequestException("You are not a participant of this conversation");
        }

        List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
        
        // Get all sender profiles
        Set<UUID> senderIds = messages.stream()
                .map(m -> m.getSender().getId())
                .collect(Collectors.toSet());
        Map<UUID, UserProfile> profileMap = getProfileMap(senderIds);

        return messages.stream()
                .map(msg -> convertToMessageResponse(msg, profileMap))
                .collect(Collectors.toList());
    }

    @Override
    public List<MessageResponse> getMessages(UUID conversationId, int page, int size) {
        UUID currentUserId = SecurityUtils.getCurrentUser().getId();

        Conversation conversation = conversationRepository.findByIdWithUsers(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        if (!conversation.hasParticipant(currentUserId)) {
            throw new BadRequestException("You are not a participant of this conversation");
        }

        Pageable pageable = PageRequest.of(page, size);
        List<Message> messages = messageRepository.findByConversationIdWithSenderOrderByCreatedAtDesc(conversationId, pageable);
        
        // Reverse to get chronological order
        Collections.reverse(messages);

        // Get all sender profiles
        Set<UUID> senderIds = messages.stream()
                .map(m -> m.getSender().getId())
                .collect(Collectors.toSet());
        Map<UUID, UserProfile> profileMap = getProfileMap(senderIds);

        return messages.stream()
                .map(msg -> convertToMessageResponse(msg, profileMap))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MessageResponse sendMessage(SendMessageRequest request) {
        UUID currentUserId = SecurityUtils.getCurrentUser().getId();
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        if (currentUserId.equals(request.getReceiverId())) {
            throw new BadRequestException("Cannot send message to yourself");
        }

        // Get or create conversation
        Conversation conversation = conversationRepository.findByUserIds(currentUserId, request.getReceiverId())
                .orElseGet(() -> {
                    User receiver = userRepository.findById(request.getReceiverId())
                            .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));
                    
                    Conversation newConv = Conversation.builder()
                            .user1(currentUser)
                            .user2(receiver)
                            .build();
                    return conversationRepository.save(newConv);
                });

        // Validate message type
        MessageType messageType;
        try {
            messageType = MessageType.valueOf(request.getMessageType());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid message type: " + request.getMessageType());
        }

        // Validate content based on type
        if (messageType == MessageType.TEXT && (request.getContent() == null || request.getContent().isBlank())) {
            throw new BadRequestException("Text message content is required");
        }
        if ((messageType == MessageType.IMAGE || messageType == MessageType.FILE) && 
            (request.getFileUrl() == null || request.getFileUrl().isBlank())) {
            throw new BadRequestException("File URL is required for image/file messages");
        }

        // Create message
        Message message = Message.builder()
                .conversation(conversation)
                .sender(currentUser)
                .messageType(messageType)
                .content(request.getContent())
                .fileUrl(request.getFileUrl())
                .fileName(request.getFileName())
                .fileSize(request.getFileSize())
                .fileType(request.getFileType())
                .isRead(false)
                .build();

        Message saved = messageRepository.save(message);

        // Update conversation's last message
        String lastContent = messageType == MessageType.TEXT ? request.getContent() : 
                            (messageType == MessageType.IMAGE ? "[Hình ảnh]" : "[Tệp đính kèm]");
        conversation.setLastMessageContent(truncate(lastContent, 500));
        conversation.setLastMessageAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        log.info("Message {} sent from {} to conversation {}", saved.getId(), currentUserId, conversation.getId());

        // Get sender profile for response
        UserProfile senderProfile = userProfileRepository.findByUserId(currentUserId).orElse(null);
        MessageResponse response = convertToMessageResponse(saved, Map.of(currentUserId, senderProfile));

        // Send real-time notification to receiver via WebSocket
        UUID receiverId = conversation.getOtherParticipant(currentUserId).getId();
        ChatMessageDto chatMessage = ChatMessageDto.builder()
                .id(saved.getId())
                .conversationId(conversation.getId())
                .senderId(currentUserId)
                .senderName(senderProfile != null ? senderProfile.getDisplayName() : "Unknown")
                .senderAvatar(senderProfile != null ? senderProfile.getAvatarUrl() : null)
                .receiverId(receiverId)
                .messageType(messageType.name())
                .content(request.getContent())
                .fileUrl(request.getFileUrl())
                .fileName(request.getFileName())
                .fileSize(request.getFileSize())
                .fileType(request.getFileType())
                .createdAt(saved.getCreatedAt())
                .build();

        messagingTemplate.convertAndSend("/topic/chat/" + receiverId.toString(), chatMessage);
        log.debug("Sent WebSocket message to /topic/chat/{}", receiverId);

        return response;
    }

    @Override
    @Transactional
    public void markMessagesAsRead(UUID conversationId) {
        UUID currentUserId = SecurityUtils.getCurrentUser().getId();

        Conversation conversation = conversationRepository.findByIdWithUsers(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        if (!conversation.hasParticipant(currentUserId)) {
            throw new BadRequestException("You are not a participant of this conversation");
        }

        messageRepository.markAsReadByConversationIdAndUserId(conversationId, currentUserId);
        log.debug("Marked messages as read in conversation {} for user {}", conversationId, currentUserId);
    }

    @Override
    public long getUnreadMessageCount() {
        UUID currentUserId = SecurityUtils.getCurrentUser().getId();
        return messageRepository.countTotalUnreadByUserId(currentUserId);
    }

    @Override
    public long getUnreadCountForConversation(UUID conversationId) {
        UUID currentUserId = SecurityUtils.getCurrentUser().getId();

        Conversation conversation = conversationRepository.findByIdWithUsers(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        if (!conversation.hasParticipant(currentUserId)) {
            throw new BadRequestException("You are not a participant of this conversation");
        }

        return messageRepository.countUnreadByConversationIdAndUserId(conversationId, currentUserId);
    }

    // Helper methods

    private Map<UUID, UserProfile> getProfileMap(Set<UUID> userIds) {
        if (userIds.isEmpty()) {
            return Collections.emptyMap();
        }
        return userProfileRepository.findByUserIdIn(userIds).stream()
                .collect(Collectors.toMap(p -> p.getUser().getId(), p -> p));
    }

    private ConversationResponse convertToConversationResponse(Conversation conversation, UUID currentUserId) {
        User otherUser = conversation.getOtherParticipant(currentUserId);
        UserProfile otherProfile = userProfileRepository.findByUserId(otherUser.getId()).orElse(null);

        long unreadCount = messageRepository.countUnreadByConversationIdAndUserId(conversation.getId(), currentUserId);

        ConversationResponse.ParticipantInfo participantInfo = ConversationResponse.ParticipantInfo.builder()
                .id(otherUser.getId())
                .displayName(otherProfile != null ? otherProfile.getDisplayName() : otherUser.getUsername())
                .avatarUrl(otherProfile != null ? otherProfile.getAvatarUrl() : null)
                .build();

        return ConversationResponse.builder()
                .id(conversation.getId())
                .participant(participantInfo)
                .lastMessageContent(conversation.getLastMessageContent())
                .lastMessageAt(conversation.getLastMessageAt())
                .unreadCount((int) unreadCount)
                .createdAt(conversation.getCreatedAt())
                .build();
    }

    private MessageResponse convertToMessageResponse(Message message, Map<UUID, UserProfile> profileMap) {
        UUID senderId = message.getSender().getId();
        UserProfile senderProfile = profileMap.get(senderId);

        return MessageResponse.builder()
                .id(message.getId())
                .conversationId(message.getConversation().getId())
                .senderId(senderId)
                .senderName(senderProfile != null ? senderProfile.getDisplayName() : message.getSender().getUsername())
                .senderAvatar(senderProfile != null ? senderProfile.getAvatarUrl() : null)
                .messageType(message.getMessageType().name())
                .content(message.getContent())
                .fileUrl(message.getFileUrl())
                .fileName(message.getFileName())
                .fileSize(message.getFileSize())
                .fileType(message.getFileType())
                .isRead(message.getIsRead())
                .createdAt(message.getCreatedAt())
                .build();
    }

    private String truncate(String str, int maxLength) {
        if (str == null) return null;
        return str.length() > maxLength ? str.substring(0, maxLength) : str;
    }
}
