package vnu.uet.volunteer_hub.volunteer_hub_backend.service.impl;

import java.util.Collection;
import java.util.Map;
import java.util.UUID;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import vnu.uet.volunteer_hub.volunteer_hub_backend.entity.Role;
import vnu.uet.volunteer_hub.volunteer_hub_backend.entity.User;
import vnu.uet.volunteer_hub.volunteer_hub_backend.model.enums.UserRoleType;
import vnu.uet.volunteer_hub.volunteer_hub_backend.repository.RoleRepository;
import vnu.uet.volunteer_hub.volunteer_hub_backend.repository.UserRepository;

/**
 * CustomOAuth2UserService
 * <p>
 * Service xử lý đăng nhập OAuth2 (Google).
 * </p>
 *
 * <p>
 * Chịu trách nhiệm:
 * <ul>
 *   <li>Lấy thông tin user từ OAuth2 provider</li>
 *   <li>Tạo user mới nếu chưa tồn tại</li>
 *   <li>Gán role mặc định VOLUNTEER</li>
 *   <li>Đảm bảo user luôn có password hợp lệ (phục vụ future login)</li>
 * </ul>
 * </p>
 */
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final EntityManager entityManager;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest)
            throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Lấy email từ OAuth2 provider
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        // Fallback cho provider trả về list emails (GitHub, v.v.)
        if (email == null) {
            Object emailsAttr = oAuth2User.getAttribute("emails");
            if (emailsAttr instanceof java.util.List<?> emailsList && !emailsList.isEmpty()) {
                Object item = emailsList.get(0);
                if (item instanceof Map<?, ?> emailMap) {
                    Object value = emailMap.get("value");
                    if (value instanceof String s) {
                        email = s;
                    }
                }
            }
        }

        if (email == null) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        User user = userRepository
                .findByEmailIgnoreCaseWithRoleOptional(email)
                .orElse(null);

        if (user == null) {
            // ===== Tạo user mới =====
            user = new User();
            user.setEmail(email);
            user.setName((name != null && !name.isBlank()) ? name : email);

            // Gán password ngẫu nhiên (đảm bảo user luôn có password hợp lệ)
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));

            user.setIsActive(Boolean.TRUE);
            user.setAccountType(UserRoleType.VOLUNTEER);

            Role volunteerRole = roleRepository.findByRoleName("VOLUNTEER")
                    .orElseThrow(() ->
                            new IllegalStateException("Default role VOLUNTEER not found"));

            // Merge role để tránh lỗi detached entity
            volunteerRole = entityManager.merge(volunteerRole);
            user.getRoles().add(volunteerRole);

            userRepository.save(user);

        } else if (user.getRoles() == null || user.getRoles().isEmpty()) {
            // ===== User tồn tại nhưng chưa có role =====
            Role volunteerRole = roleRepository.findByRoleName("VOLUNTEER")
                    .orElseThrow(() ->
                            new IllegalStateException("Default role VOLUNTEER not found"));

            volunteerRole = entityManager.merge(volunteerRole);
            user.getRoles().add(volunteerRole);

            if (user.getAccountType() == null) {
                user.setAccountType(UserRoleType.VOLUNTEER);
            }

            userRepository.save(user);
        }

        final String finalEmail = email;

        // Trả về OAuth2User để Spring Security tiếp tục flow
        return new OAuth2User() {
            @Override
            public <A> A getAttribute(String attributeName) {
                return oAuth2User.getAttribute(attributeName);
            }

            @Override
            public Map<String, Object> getAttributes() {
                return oAuth2User.getAttributes();
            }

            @Override
            public Collection<? extends GrantedAuthority> getAuthorities() {
                return oAuth2User.getAuthorities();
            }

            @Override
            public String getName() {
                return finalEmail;
            }
        };
    }
}
