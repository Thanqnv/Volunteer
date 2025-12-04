package vnu.uet.volunteer_hub.volunteer_hub_backend.api;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
            List<EventSimpleDTO> approvedEvents = approvedEventsList.stream()
                    .map(e -> new EventSimpleDTO(
                            e.getId().toString(),
                            e.getTitle(),
                            e.getLocation(),
                            e.getDescription()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ResponseDTO.<List<EventSimpleDTO>>builder()
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
     * Simple DTO for event list
     */
    public record EventSimpleDTO(String id, String title, String location, String description) {
    }
}
