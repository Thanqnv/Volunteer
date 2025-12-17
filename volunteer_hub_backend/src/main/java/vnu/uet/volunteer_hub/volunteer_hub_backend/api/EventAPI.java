package vnu.uet.volunteer_hub.volunteer_hub_backend.api;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.request.CreateEventRequest;
import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.request.UpdateEventRequest;
import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.response.CheckInResponseDTO;
import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.response.EventResponseDTO;
import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.response.JoinEventResponse;
import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.response.ParticipantResponseDTO;
import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.response.ResponseDTO;
import vnu.uet.volunteer_hub.volunteer_hub_backend.entity.Event;
import vnu.uet.volunteer_hub.volunteer_hub_backend.model.enums.EventApprovalStatus;
import vnu.uet.volunteer_hub.volunteer_hub_backend.service.EventService;
import vnu.uet.volunteer_hub.volunteer_hub_backend.service.UserService;
@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventAPI {

    private final EventService eventService;
    private final UserService userService;

    /* ================= CREATE & UPDATE ================= */

    @PostMapping("/{creatorId}")
    public ResponseEntity<?> createEvent(
            @Valid @RequestBody CreateEventRequest request,
            @PathVariable UUID creatorId) {

        if (request.getStartTime() != null && request.getEndTime() != null
                && !request.getStartTime().isBefore(request.getEndTime())) {
            return ResponseEntity.badRequest()
                    .body(ResponseDTO.builder()
                            .message("Thời gian kết thúc phải sau thời gian bắt đầu")
                            .build());
        }

        EventResponseDTO response = eventService.createEvent(request, creatorId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ResponseDTO.<EventResponseDTO>builder()
                        .message("Event created successfully")
                        .data(response)
                        .build());
    }

    @PutMapping("/{id}/{updaterId}")
    public ResponseEntity<?> updateEvent(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateEventRequest request,
            @PathVariable UUID updaterId) {

        EventResponseDTO response = eventService.updateEvent(id, request, updaterId);
        return ResponseEntity.ok(
                ResponseDTO.<EventResponseDTO>builder()
                        .message("Event updated successfully")
                        .data(response)
                        .build());
    }

    /* ================= LIST & FILTER ================= */

    @GetMapping
    public ResponseEntity<?> getEvents(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
            @RequestParam(required = false) EventApprovalStatus status) {

        List<Event> events = (q != null || category != null || fromDate != null || toDate != null || status != null)
                ? eventService.getEventsWithFilters(q, category, fromDate, toDate, status)
                : eventService.getApprovedEvents();

        List<EventFeedDTO> feed = events.stream()
                .map(this::mapToFeedDTO)
                .toList();

        return ResponseEntity.ok(
                ResponseDTO.<List<EventFeedDTO>>builder()
                        .message("Events retrieved successfully")
                        .data(feed)
                        .build());
    }

    /* ================= EVENT DETAIL ================= */

    @GetMapping("/{id}")
    public ResponseEntity<?> getApprovedEventDetail(@PathVariable UUID id) {
        Event event = eventService.getApprovedEvent(id);
        return ResponseEntity.ok(
                ResponseDTO.<EventFeedDTO>builder()
                        .message("Event retrieved successfully")
                        .data(mapToFeedDTO(event))
                        .build());
    }

    /* ================= PARTICIPATION ================= */

    @PostMapping("/{eventId}/participants")
    public ResponseEntity<?> joinEvent(@PathVariable UUID eventId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = userService.getViewerIdFromAuthentication(auth);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ResponseDTO.builder()
                            .message("Not authenticated")
                            .build());
        }

        JoinEventResponse response = eventService.joinEvent(eventId, userId);
        return ResponseEntity.ok(
                ResponseDTO.<JoinEventResponse>builder()
                        .message("Successfully joined event")
                        .data(response)
                        .build());
    }

    @DeleteMapping("/{eventId}/participants")
    public ResponseEntity<?> leaveEvent(@PathVariable UUID eventId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = userService.getViewerIdFromAuthentication(auth);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ResponseDTO.builder()
                            .message("Not authenticated")
                            .build());
        }

        JoinEventResponse response = eventService.leaveEvent(eventId, userId);
        return ResponseEntity.ok(
                ResponseDTO.<JoinEventResponse>builder()
                        .message("Successfully left event")
                        .data(response)
                        .build());
    }

    @GetMapping("/{eventId}/participants")
    public ResponseEntity<?> getParticipants(@PathVariable UUID eventId) {
        List<ParticipantResponseDTO> participants = eventService.getParticipants(eventId);
        return ResponseEntity.ok(
                ResponseDTO.<List<ParticipantResponseDTO>>builder()
                        .message("Participants retrieved successfully")
                        .data(participants)
                        .build());
    }

    @PostMapping("/{eventId}/check-in/{userId}")
    public ResponseEntity<?> checkInVolunteer(
            @PathVariable UUID eventId,
            @PathVariable UUID userId) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID checkerId = userService.getViewerIdFromAuthentication(auth);
        if (checkerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ResponseDTO.builder()
                            .message("Not authenticated")
                            .build());
        }

        CheckInResponseDTO response = eventService.checkInVolunteer(eventId, userId, checkerId);
        return ResponseEntity.ok(
                ResponseDTO.<CheckInResponseDTO>builder()
                        .message(response.getMessage())
                        .data(response)
                        .build());
    }
    /**
     * Lấy số lượng sự kiện sắp diễn ra trong vòng 1 tháng
     */
    @GetMapping("/upcoming-count")
    public ResponseEntity<?> getUpcomingEventsCount() {
        long count = eventService.countUpcomingEvents();
        return ResponseEntity.ok(
                ResponseDTO.<Long>builder()
                        .message("Upcoming events count retrieved successfully")
                        .data(count)
                        .build());
    }

    /* ================= MAPPING ================= */

    private EventFeedDTO mapToFeedDTO(Event e) {
        return new EventFeedDTO(
                e.getId().toString(),
                e.getTitle(),
                e.getDescription(),
                e.getLocation(),
                e.getStartTime(),
                e.getEndTime(),
                e.getRegistrationDeadline(),
                e.getMaxVolunteers()
        );
    }

    public record EventFeedDTO(
            String id,
            String title,
            String description,
            String location,
            LocalDateTime startTime,
            LocalDateTime endTime,
            LocalDateTime registrationDeadline,
            Integer maxVolunteers) {
    }
}
