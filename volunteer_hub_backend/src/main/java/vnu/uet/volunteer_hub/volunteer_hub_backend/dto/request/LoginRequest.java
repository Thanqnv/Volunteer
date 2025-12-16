package vnu.uet.volunteer_hub.volunteer_hub_backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

/**
 * Request DTO for email/password login.
 */
@Getter
@Setter
public class LoginRequest {

    @NotBlank(message = "Email khong duoc de trong")
    @Email(message = "Email khong hop le")
    private String email;

    @NotBlank(message = "Mat khau khong duoc de trong")
    private String password;

    @NotBlank(message = "Vai tro khong duoc de trong")
    @Pattern(regexp = "VOLUNTEER|MANAGER|ADMIN", message = "Role phai la VOLUNTEER, MANAGER hoac ADMIN")
    private String role;
}
