package vnu.uet.volunteer_hub.volunteer_hub_backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import vnu.uet.volunteer_hub.volunteer_hub_backend.entity.PostReaction;

public interface PostReactionRepository extends JpaRepository<PostReaction, UUID> {
}
