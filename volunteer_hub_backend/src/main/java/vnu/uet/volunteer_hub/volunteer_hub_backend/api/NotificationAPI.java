package vnu.uet.volunteer_hub.volunteer_hub_backend.api;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.response.NotificationResponseDTO;
import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.response.ResponseDTO;
import vnu.uet.volunteer_hub.volunteer_hub_backend.service.NotificationService;
import vnu.uet.volunteer_hub.volunteer_hub_backend.service.UserService;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationAPI {

    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping("/{recipientId}")
    public ResponseEntity<ResponseDTO<Page<NotificationResponseDTO>>> getNotifications(@PathVariable UUID recipientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Boolean isRead) {
        // [TEST MODE] userId được truyền từ path parameter
        // Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // UUID userId = userService.getViewerIdFromAuthentication(auth);
        Page<NotificationResponseDTO> result = notificationService.getNotifications(recipientId, isRead, page, size);
        return ResponseEntity.ok(ResponseDTO.<Page<NotificationResponseDTO>>builder().data(result).build());
    }
}
