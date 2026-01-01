package octguy.livanabe.service;

import octguy.livanabe.dto.response.NotificationMessage;
import octguy.livanabe.dto.response.NotificationResponse;

import java.util.List;
import java.util.UUID;

public interface INotificationService {
    
    void sendBookingNotificationToHost(UUID hostId, NotificationMessage notification);
    
    void pushNotificationToUser(UUID userId, NotificationMessage notification);
    
    List<NotificationResponse> getNotificationsByRecipientId(UUID recipientId);
    
    List<NotificationResponse> getUnreadNotifications(UUID recipientId);
    
    long countUnreadNotifications(UUID recipientId);
    
    NotificationResponse markAsRead(UUID notificationId);
    
    void markAllAsRead(UUID recipientId);
}
