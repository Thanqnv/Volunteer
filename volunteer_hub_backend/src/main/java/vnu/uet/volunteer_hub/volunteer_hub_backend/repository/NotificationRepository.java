package vnu.uet.volunteer_hub.volunteer_hub_backend.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;

import vnu.uet.volunteer_hub.volunteer_hub_backend.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    Page<Notification> findByRecipientId(UUID recipientId, Pageable pageable);

    Page<Notification> findByRecipientIdAndIsRead(UUID recipientId, Boolean isRead, Pageable pageable);
}
