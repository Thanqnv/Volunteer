package vnu.uet.volunteer_hub.volunteer_hub_backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

    @Override
    @Transactional
    public void markAsRead(UUID notificationId, UUID userId) {
        Notification notification = notificationRepository.findByIdAndRecipientId(notificationId, userId)
                .orElseThrow(() -> new RuntimeException("Notification not found or you don't have permission"));

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(UUID userId) {
        notificationRepository.markAllAsReadByRecipientId(userId);
    }

    @Override
    @Transactional
    public void deleteNotification(UUID notificationId, UUID userId) {
        Notification notification = notificationRepository.findByIdAndRecipientId(notificationId, userId)
                .orElseThrow(() -> new RuntimeException("Notification not found or you don't have permission"));

        notificationRepository.delete(notification);
    }

    @Override
    public Long getUnreadCount(UUID userId) {
        return notificationRepository.countByRecipientIdAndIsRead(userId, false);
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
