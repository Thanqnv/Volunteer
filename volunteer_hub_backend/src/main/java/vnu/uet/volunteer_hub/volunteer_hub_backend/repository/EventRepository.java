package vnu.uet.volunteer_hub.volunteer_hub_backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import vnu.uet.volunteer_hub.volunteer_hub_backend.entity.Event;
import vnu.uet.volunteer_hub.volunteer_hub_backend.model.enums.EventApprovalStatus;

public interface EventRepository extends JpaRepository<Event, UUID> {
    List<Event> findAllByAdminApprovalStatusAndIsArchived(EventApprovalStatus status, Boolean isArchived);
}
