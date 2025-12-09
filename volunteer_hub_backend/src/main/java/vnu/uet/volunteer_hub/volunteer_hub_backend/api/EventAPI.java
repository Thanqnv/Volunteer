package vnu.uet.volunteer_hub.volunteer_hub_backend.api;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.response.ResponseDTO;
import vnu.uet.volunteer_hub.volunteer_hub_backend.entity.Event;
import vnu.uet.volunteer_hub.volunteer_hub_backend.service.EventService;

@RestController
@RequestMapping("/api/events")
public class EventAPI {

    private final EventService eventService;

    public EventAPI(EventService eventService) {
        this.eventService = eventService;
    }

    /**
     * Get all approved events for creating posts.
     * GET /api/events
     * Response: List of approved events
     */
    @GetMapping
    public ResponseEntity<?> getApprovedEvents() {
        try {
            List<Event> approvedEventsList = eventService.getApprovedEvents();

            // Map to simple DTO
            List<EventFeedDTO> approvedEvents = approvedEventsList.stream()
                    .map(this::mapToFeedDTO)
                    .toList();

            return ResponseEntity.ok(ResponseDTO.<List<EventFeedDTO>>builder()
                    .message("Events retrieved successfully")
                    .data(approvedEvents)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ResponseDTO.builder()
                            .message("Failed to retrieve events")
                            .detail(e.getMessage())
                            .build());
        }
    }

    /**
     * Get event detail for approved, non-archived events.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getApprovedEventDetail(@PathVariable String id) {
        try {
            Event event = eventService.getApprovedEvent(UUID.fromString(id));
            return ResponseEntity.ok(ResponseDTO.<EventFeedDTO>builder()
                    .message("Event retrieved successfully")
                    .data(mapToFeedDTO(event))
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ResponseDTO.builder()
                    .message("Invalid event id format")
                    .detail(e.getMessage())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ResponseDTO.builder()
                    .message("Failed to retrieve event")
                    .detail(e.getMessage())
                    .build());
        }
    }

    private EventFeedDTO mapToFeedDTO(Event e) {
        return new EventFeedDTO(
                e.getId().toString(),
                e.getTitle(),
                e.getDescription(),
                e.getLocation(),
                e.getStartTime(),
                e.getEndTime(),
                e.getRegistrationDeadline(),
                e.getMaxVolunteers());
    }

    /**
     * DTO for user-facing event feed.
     */
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
