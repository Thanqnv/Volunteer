package vnu.uet.volunteer_hub.volunteer_hub_backend.api;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.request.ForgotPasswordRequest;
import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.request.LoginRequest;
import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.request.RegistrationRequest;
import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.request.ResetPasswordRequest;
import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.request.ValidateResetTokenRequest;
import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.response.LoginResponse;
import vnu.uet.volunteer_hub.volunteer_hub_backend.dto.response.ResponseDTO;
import vnu.uet.volunteer_hub.volunteer_hub_backend.entity.PasswordResetToken;
import vnu.uet.volunteer_hub.volunteer_hub_backend.entity.Role;
import vnu.uet.volunteer_hub.volunteer_hub_backend.entity.User;
import vnu.uet.volunteer_hub.volunteer_hub_backend.model.enums.UserRoleType;
import vnu.uet.volunteer_hub.volunteer_hub_backend.model.utils.JwtUtil;
import vnu.uet.volunteer_hub.volunteer_hub_backend.repository.UserRepository;
import vnu.uet.volunteer_hub.volunteer_hub_backend.service.EmailService;
import vnu.uet.volunteer_hub.volunteer_hub_backend.service.PasswordResetTokenService;
import vnu.uet.volunteer_hub.volunteer_hub_backend.service.RateLimitService;
import vnu.uet.volunteer_hub.volunteer_hub_backend.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthAPI {

    private static final Logger logger = LoggerFactory.getLogger(AuthAPI.class);

    private final UserService userService;
    private final EmailService emailService;
    private final PasswordResetTokenService passwordResetTokenService;
    private final RateLimitService rateLimitService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Value("${security.jwt.expiration-ms}")
    private long jwtExpirationMs;

    public AuthAPI(
            UserService userService,
            EmailService emailService,
            PasswordResetTokenService passwordResetTokenService,
            RateLimitService rateLimitService,
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil,
            UserRepository userRepository) {

        this.userService = userService;
        this.emailService = emailService;
        this.passwordResetTokenService = passwordResetTokenService;
        this.rateLimitService = rateLimitService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(
            @Valid @RequestBody RegistrationRequest registrationRequest,
            BindingResult bindingResult) {

        ResponseEntity<?> errorResponse = getErrorResponse(bindingResult);
        if (errorResponse != null) return errorResponse;

        try {
            userService.registerUser(registrationRequest);
            return ResponseEntity.ok(
                    ResponseDTO.<RegistrationRequest>builder()
                            .message("User created successfully")
                            .data(registrationRequest)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    ResponseDTO.<Void>builder()
                            .message("Error creating user")
                            .detail(e.getMessage())
                            .build()
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            BindingResult bindingResult) {

        ResponseEntity<?> errorResponse = getErrorResponse(bindingResult);
        if (errorResponse != null) return errorResponse;

        UserRoleType requestedRole = UserRoleType.fromString(request.getRole());
        if (requestedRole == null) {
            return ResponseEntity.badRequest().body(
                    ResponseDTO.<Void>builder()
                            .message("Role khong hop le")
                            .build()
            );
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            User user = userService.findByEmail(request.getEmail());
            if (user == null) throw new RuntimeException("User not found");

            boolean hasRequestedRole = user.getRoles().stream()
                    .anyMatch(r -> r != null &&
                            requestedRole.name().equalsIgnoreCase(r.getRoleName()));

            if (!hasRequestedRole) {
                throw new RuntimeException("User does not have requested role");
            }

            if (user.getAccountType() == null) {
                user.setAccountType(requestedRole);
                userRepository.save(user);
            }

            String role = user.getRoles().stream()
                    .findFirst()
                    .map(Role::getRoleName)
                    .orElse(requestedRole.name());

            String token = jwtUtil.generateToken(
                    user.getId().toString(),
                    user.getEmail(),
                    role
            );

            LoginResponse loginResponse = LoginResponse.builder()
                    .accessToken(token)
                    .tokenType("Bearer")
                    .expiresIn(jwtExpirationMs)
                    .userId(user.getId().toString())
                    .email(user.getEmail())
                    .role(role)
                    .displayName(user.getName())
                    .build();

            return ResponseEntity.ok(
                    ResponseDTO.<LoginResponse>builder()
                            .message("Login successful")
                            .data(loginResponse)
                            .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(401).body(
                    ResponseDTO.<Void>builder()
                            .message("Invalid email, password, or role")
                            .build()
            );
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()
                    || "anonymousUser".equals(auth.getPrincipal())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                        ResponseDTO.<Void>builder()
                                .message("Not authenticated")
                                .build()
                );
            }

            Map<String, Object> info = new HashMap<>();

            Object principal = auth.getPrincipal();
            UUID id = (principal instanceof UUID)
                    ? (UUID) principal
                    : userService.getViewerIdFromAuthentication(auth);

            info.put("id", id != null ? id.toString() : null);
            info.put("roles", auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList());

            return ResponseEntity.ok(
                    ResponseDTO.<Map<String, Object>>builder()
                            .message("Current user retrieved")
                            .data(info)
                            .build()
            );

        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    ResponseDTO.<Void>builder()
                            .message("Unable to retrieve current user")
                            .detail(e.getMessage())
                            .build()
            );
        }
    }

    // ===== Helpers =====

    private ResponseEntity<?> getErrorResponse(BindingResult bindingResult) {
        if (!bindingResult.hasErrors()) return null;

        List<String> errors = bindingResult.getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .toList();

        return ResponseEntity.badRequest().body(
                ResponseDTO.<List<String>>builder()
                        .message("Validation failed")
                        .data(errors)
                        .build()
        );
    }
}
