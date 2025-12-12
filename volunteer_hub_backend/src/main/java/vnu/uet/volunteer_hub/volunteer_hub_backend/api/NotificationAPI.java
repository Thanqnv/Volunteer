package vnu.uet.volunteer_hub.volunteer_hub_backend.api;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.response.NotificationResponseDTO;
import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.response.ResponseDTO;
import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.response.UnreadCountResponseDTO;
import vnu.uet.volunteer_hub.volunteer_hub_backend.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationAPI {

    private final NotificationService notificationService;

    @GetMapping("/{recipientId}")
    public ResponseEntity<ResponseDTO<Page<NotificationResponseDTO>>> getNotifications(@PathVariable UUID recipientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Boolean isRead) {
        try {
            // [TEST MODE] userId được truyền từ path parameter
            // Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            // UUID userId = userService.getViewerIdFromAuthentication(auth);
            Page<NotificationResponseDTO> result = notificationService.getNotifications(recipientId, isRead, page,
                    size);
            return ResponseEntity.ok(ResponseDTO.<Page<NotificationResponseDTO>>builder().data(result).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ResponseDTO.<Page<NotificationResponseDTO>>builder()
                    .message("Failed to get notifications: " + e.getMessage()).build());
        }
    }

    @PutMapping("/{notificationId}/read/{userId}")
    public ResponseEntity<ResponseDTO<String>> markAsRead(@PathVariable UUID notificationId,
            @PathVariable UUID userId) {
        try {
            // [TEST MODE] userId được truyền từ query parameter
            // Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            // UUID userId = userService.getViewerIdFromAuthentication(auth);
            notificationService.markAsRead(notificationId, userId);
            return ResponseEntity
                    .ok(ResponseDTO.<String>builder().data("Notification marked as read successfully").build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ResponseDTO.<String>builder()
                    .message("Failed to mark notification as read: " + e.getMessage()).build());
        }
    }

    @PutMapping("/read-all/{userId}")
    public ResponseEntity<ResponseDTO<String>> markAllAsRead(@PathVariable UUID userId) {
        try {
            // [TEST MODE] userId được truyền từ query parameter
            // Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            // UUID userId = userService.getViewerIdFromAuthentication(auth);
            notificationService.markAllAsRead(userId);
            return ResponseEntity
                    .ok(ResponseDTO.<String>builder().data("All notifications marked as read successfully").build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ResponseDTO.<String>builder()
                    .message("Failed to mark all notifications as read: " + e.getMessage()).build());
        }
    }

    @DeleteMapping("/{notificationId}/{userId}")
    public ResponseEntity<ResponseDTO<String>> deleteNotification(@PathVariable UUID notificationId,
            @PathVariable UUID userId) {
        try {
            // [TEST MODE] userId được truyền từ query parameter
            // Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            // UUID userId = userService.getViewerIdFromAuthentication(auth);
            notificationService.deleteNotification(notificationId, userId);
            return ResponseEntity.ok(ResponseDTO.<String>builder().data("Notification deleted successfully").build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ResponseDTO.<String>builder().message("Failed to delete notification: " + e.getMessage()).build());
        }
    }

    @GetMapping("/unread-count/{userId}")
    public ResponseEntity<ResponseDTO<UnreadCountResponseDTO>> getUnreadCount(@PathVariable UUID userId) {
        try {
            // [TEST MODE] userId được truyền từ query parameter
            // Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            // UUID userId = userService.getViewerIdFromAuthentication(auth);
            Long count = notificationService.getUnreadCount(userId);
            UnreadCountResponseDTO response = UnreadCountResponseDTO.builder()
                    .unreadCount(count)
                    .build();
            return ResponseEntity.ok(ResponseDTO.<UnreadCountResponseDTO>builder().data(response).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ResponseDTO.<UnreadCountResponseDTO>builder()
                    .message("Failed to get unread count: " + e.getMessage()).build());
        }
    }
}
