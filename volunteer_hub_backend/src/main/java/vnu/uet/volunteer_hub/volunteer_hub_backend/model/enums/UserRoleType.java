package vnu.uet.volunteer_hub.volunteer_hub_backend.model.enums;

/**
 * Canonical user role types used for authentication flows.
 * Values align with records in the {@code roles} table.
 */
public enum UserRoleType {
    VOLUNTEER,
    MANAGER,
    ADMIN;

    public static UserRoleType fromString(String value) {
        if (value == null) {
            return null;
        }
        return UserRoleType.valueOf(value.trim().toUpperCase());
    }
}
