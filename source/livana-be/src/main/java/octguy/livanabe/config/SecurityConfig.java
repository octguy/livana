package octguy.livanabe.config;

import octguy.livanabe.jwt.JwtAuthenticationEntryPoint;
import octguy.livanabe.jwt.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint authenticationEntryPoint;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationEntryPoint authenticationEntryPoint, JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        String[] CATALOG = {
                "/api/v1/property-types/**",
                "/api/v1/experience-categories/**",
                "/api/v1/facilities/**",
                "/api/v1/amenities/**",
                "/api/v1/interests/**"
        };

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth

                        // ===== PUBLIC AUTH =====
                        .requestMatchers(
                                "/api/v1/auth/register",
                                "/api/v1/auth/login",
                                "/api/v1/auth/verify",
                                "/api/v1/auth/forgot-password",
                                "/api/v1/auth/reset-password",
                                "/api/v1/auth/refresh-token"
                        ).permitAll()

                        // ===== LOGOUT (authenticated required) =====
                        .requestMatchers("/api/v1/auth/logout")
                        .authenticated()

                        // ===== REGISTER ADMIN -> ADMIN only =====
                        .requestMatchers("/api/v1/auth/register-admin")
                        .hasRole("ADMIN")

                        // ===== Swagger =====
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/v3/api-docs.yaml",
                                "/swagger-resources/**",
                                "/webjars/**",
                                "/api/v1/listings/homes/**",
                                "/api/v1/listings/experiences/**",
                                "/ws/**"
                        ).permitAll()
                        
                        // ===== Public Reviews (GET listing reviews) =====
                        .requestMatchers(HttpMethod.GET, "/api/v1/reviews/listing/**").permitAll()

                        // ===== Catalog GET (both role) =====
                        .requestMatchers(HttpMethod.GET, CATALOG).permitAll()

                        // ===== Modify catalog only ADMIN =====
                        .requestMatchers(HttpMethod.POST, CATALOG).hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, CATALOG).hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, CATALOG).hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, CATALOG).hasRole("ADMIN")

                        // ===== Other endpoints for USER + ADMIN =====
                        .requestMatchers(
                                "/api/v1/dummy/**",
                                "/api/v1/auth/change-password",
                                "/api/v1/users/**"
                        ).hasAnyRole("USER", "ADMIN")

                        // ===== remaining need authentication =====
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex.authenticationEntryPoint(authenticationEntryPoint))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


}
