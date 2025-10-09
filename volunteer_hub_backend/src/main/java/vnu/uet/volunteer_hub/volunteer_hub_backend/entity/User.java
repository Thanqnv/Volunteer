package vnu.uet.volunteer_hub.volunteer_hub_backend.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.CascadeType;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users")
@AttributeOverride(name = "id", column = @Column(name = "user_id", nullable = false, updatable = false))
public class User extends BaseEntity {

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", columnDefinition = "TEXT", nullable = false)
    private String password;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = Boolean.TRUE;

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "createdBy", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Event> createdEvents = new HashSet<>();

    @OneToMany(mappedBy = "volunteer", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Registration> registrations = new HashSet<>();

    @OneToMany(mappedBy = "approvedBy", fetch = FetchType.LAZY)
    private Set<Registration> approvedRegistrations = new HashSet<>(); // Not orphanRemoval, not always owned

    @OneToMany(mappedBy = "author", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Post> posts = new HashSet<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PostReaction> postReactions = new HashSet<>();

    @OneToMany(mappedBy = "recipient", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Notification> notifications = new HashSet<>();

    @PrePersist
    public void prePersist() {
        if (isActive == null) {
            isActive = Boolean.TRUE;
        }
    }
}
