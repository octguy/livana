package octguy.livanabe.consumer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import octguy.livanabe.config.RabbitMQConfig;
import octguy.livanabe.dto.response.NotificationMessage;
import octguy.livanabe.service.INotificationService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumer {

    private final INotificationService notificationService;

    @RabbitListener(queues = RabbitMQConfig.NOTIFICATION_QUEUE)
    public void consumeNotification(NotificationMessage notification) {
        log.info("Received notification from RabbitMQ: {} for recipient: {}", 
                notification.getTitle(), notification.getRecipientId());
        
        // Push notification to the host via WebSocket
        notificationService.pushNotificationToUser(notification.getRecipientId(), notification);
        
        log.info("Notification pushed to WebSocket for user: {}", notification.getRecipientId());
    }
}
