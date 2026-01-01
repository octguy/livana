package octguy.livanabe.controller;

import lombok.RequiredArgsConstructor;
import octguy.livanabe.dto.response.NotificationResponse;
import octguy.livanabe.entity.ApiResponse;
import octguy.livanabe.service.INotificationService;
import octguy.livanabe.utils.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final INotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getMyNotifications() {
        UUID userId = SecurityUtils.getCurrentUser().getId();
        List<NotificationResponse> notifications = notificationService.getNotificationsByRecipientId(userId);

        ApiResponse<List<NotificationResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Notifications retrieved successfully",
                notifications,
                null
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUnreadNotifications() {
        UUID userId = SecurityUtils.getCurrentUser().getId();
        List<NotificationResponse> notifications = notificationService.getUnreadNotifications(userId);

        ApiResponse<List<NotificationResponse>> response = new ApiResponse<>(
                HttpStatus.OK,
                "Unread notifications retrieved successfully",
                notifications,
                null
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread/count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        UUID userId = SecurityUtils.getCurrentUser().getId();
        long count = notificationService.countUnreadNotifications(userId);

        ApiResponse<Long> response = new ApiResponse<>(
                HttpStatus.OK,
                "Unread count retrieved successfully",
                count,
                null
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(@PathVariable UUID id) {
        NotificationResponse notification = notificationService.markAsRead(id);

        ApiResponse<NotificationResponse> response = new ApiResponse<>(
                HttpStatus.OK,
                "Notification marked as read",
                notification,
                null
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        UUID userId = SecurityUtils.getCurrentUser().getId();
        notificationService.markAllAsRead(userId);

        ApiResponse<Void> response = new ApiResponse<>(
                HttpStatus.OK,
                "All notifications marked as read",
                null,
                null
        );

        return ResponseEntity.ok(response);
    }
}
