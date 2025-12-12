package vnu.uet.volunteer_hub.volunteer_hub_backend.service;

import java.util.UUID;

import org.springframework.data.domain.Page;

import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.response.NotificationResponseDTO;

public interface NotificationService {
    Page<NotificationResponseDTO> getNotifications(UUID recipientId, Boolean isRead, int page, int size);
}
