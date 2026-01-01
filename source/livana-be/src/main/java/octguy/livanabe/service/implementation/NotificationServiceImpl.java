package octguy.livanabe.service.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import octguy.livanabe.config.RabbitMQConfig;
import octguy.livanabe.dto.response.NotificationMessage;
import octguy.livanabe.dto.response.NotificationResponse;
import octguy.livanabe.entity.Notification;
import octguy.livanabe.entity.User;
import octguy.livanabe.enums.NotificationType;
import octguy.livanabe.exception.ResourceNotFoundException;
import octguy.livanabe.repository.NotificationRepository;
import octguy.livanabe.repository.UserRepository;
import octguy.livanabe.service.INotificationService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements INotificationService {

    private final RabbitTemplate rabbitTemplate;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void sendBookingNotificationToHost(UUID hostId, NotificationMessage notification) {
        log.info("Saving and sending booking notification for host: {}", hostId);
        
        // Persist notification to database
        User recipient = userRepository.findById(hostId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Notification entity = Notification.builder()
                .recipient(recipient)
                .type(NotificationType.valueOf(notification.getType()))
                .title(notification.getTitle())
                .message(notification.getMessage())
                .referenceId(notification.getId())
                .isRead(false)
                .build();
        
        Notification saved = notificationRepository.save(entity);
        notification.setId(saved.getId());
        
        // Send to RabbitMQ for WebSocket delivery
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.NOTIFICATION_EXCHANGE,
                RabbitMQConfig.NOTIFICATION_ROUTING_KEY,
                notification
        );
    }

    @Override
    public void pushNotificationToUser(UUID userId, NotificationMessage notification) {
        log.info("Pushing notification via WebSocket to user: {}", userId);
        messagingTemplate.convertAndSend(
                "/topic/notifications/" + userId.toString(),
                notification
        );
    }

    @Override
    public List<NotificationResponse> getNotificationsByRecipientId(UUID recipientId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(recipientId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationResponse> getUnreadNotifications(UUID recipientId) {
        return notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(recipientId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public long countUnreadNotifications(UUID recipientId) {
        return notificationRepository.countUnreadByRecipientId(recipientId);
    }

    @Override
    @Transactional
    public NotificationResponse markAsRead(UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        
        notification.setIsRead(true);
        Notification saved = notificationRepository.save(notification);
        return convertToResponse(saved);
    }

    @Override
    @Transactional
    public void markAllAsRead(UUID recipientId) {
        notificationRepository.markAllAsReadByRecipientId(recipientId);
    }

    private NotificationResponse convertToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .recipientId(notification.getRecipient().getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .referenceId(notification.getReferenceId())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
