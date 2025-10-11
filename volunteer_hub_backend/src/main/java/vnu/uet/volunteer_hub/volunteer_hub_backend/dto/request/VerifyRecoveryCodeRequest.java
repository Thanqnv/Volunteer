package vnu.uet.volunteer_hub.volunteer_hub_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyRecoveryCodeRequest {
    @NotBlank(message = "Mã khôi phục không được để trống")
    @Pattern(regexp = "\\d{6}", message = "Mã khôi phục phải là 6 chữ số")
    private String code;
}
