package vnu.uet.volunteer_hub.volunteer_hub_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.response.NotificationResponseDTO;
import vnu.uet.volunteer_hub.volunteer_hub_backend.entity.Notification;
import vnu.uet.volunteer_hub.volunteer_hub_backend.repository.NotificationRepository;
import vnu.uet.volunteer_hub.volunteer_hub_backend.service.NotificationService;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public Page<NotificationResponseDTO> getNotifications(UUID recipientId, Boolean isRead, int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Notification> notifications = (isRead == null)
                ? notificationRepository.findByRecipientId(recipientId, pageable)
                : notificationRepository.findByRecipientIdAndIsRead(recipientId, isRead, pageable);

        return notifications.map(this::toDto);
    }

    private NotificationResponseDTO toDto(Notification notification) {
        return NotificationResponseDTO.builder()
                .notificationId(notification.getId())
                .recipientId(notification.getRecipient() != null ? notification.getRecipient().getId() : null)
                .eventId(notification.getEvent() != null ? notification.getEvent().getId() : null)
                .title(notification.getTitle())
                .body(notification.getBody())
                .notificationType(
                        notification.getNotificationType() != null ? notification.getNotificationType().name() : null)
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
