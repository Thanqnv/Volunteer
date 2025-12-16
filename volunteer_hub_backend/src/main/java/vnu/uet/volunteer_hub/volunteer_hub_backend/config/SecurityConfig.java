package vnu.uet.volunteer_hub.volunteer_hub_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import vnu.uet.volunteer_hub.volunteer_hub_backend.service.impl.CustomOAuth2UserService;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final ClientRegistrationRepository clientRegistrationRepository;

    // Frontend URL (comma-separated)
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // Disable CSRF for stateless REST API
                .csrf(AbstractHttpConfigurer::disable)

                // Enable CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Stateless session (JWT)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Authorization rules
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers(
                                "/ui/**",
                                "/api/auth/**",
                                "/api/dashboard/**",
                                "/api/events/**",
                                "/api/registrations/**",
                                "/api/posts/visible",
                                "/api/posts/{postId}",
                                "/api/posts",
                                "/api/posts/**",
                                "/api/comments/**",
                                "/api/users/**",
                                "/api/search/autocomplete/**",
                                "/api/users/profile/**",
                                "/api/notifications/**",
                                "/oauth2/**",
                                "/login/oauth2/**",
                                "/error")
                        .permitAll()

                        // Allow anonymous GET posts
                        .requestMatchers(HttpMethod.GET, "/api/posts")
                        .permitAll()

                        // Allow check-in without auth (test / kiosk mode)
                        .requestMatchers(HttpMethod.POST, "/api/events/*/check-in/*")
                        .permitAll()

                        // Admin endpoints (TODO: restrict by role later)
                        .requestMatchers("/api/admin/**")
                        .permitAll()

                        // All other requests require authentication
                        .anyRequest()
                        .authenticated())

                // Exception handling
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setContentType("application/json");
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write(
                                    "{\"data\":null,\"message\":\"Unauthorized\",\"detail\":\"Authentication required. Please provide a valid JWT token.\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setContentType("application/json");
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.getWriter().write(
                                    "{\"data\":null,\"message\":\"Forbidden\",\"detail\":\"You don't have permission to access this resource.\"}");
                        }))

                // OAuth2 Login (Google)
                .oauth2Login(oauth2 -> {
                    OAuth2AuthorizationRequestResolver resolver =
                            new CustomAuthorizationRequestResolver(
                                    clientRegistrationRepository,
                                    "/oauth2/authorization");

                    oauth2
                            .authorizationEndpoint(endpoint ->
                                    endpoint.authorizationRequestResolver(resolver))
                            .userInfoEndpoint(userInfo ->
                                    userInfo.userService(customOAuth2UserService))
                            .successHandler(oAuth2AuthenticationSuccessHandler);
                });

        // JWT filter
        http.addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        var origins = java.util.Arrays.stream(frontendUrl.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        configuration.setAllowedOrigins(origins);
        configuration.setAllowedMethods(
                java.util.List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(
                java.util.List.of(
                        "Authorization",
                        "Content-Type",
                        "Accept",
                        "Origin",
                        "X-Requested-With"));
        configuration.setExposedHeaders(
                java.util.List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
