//package com.induspathfinder.app.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//import com.induspathfinder.app.security.JwtAuthenticationFilter;
//
//import lombok.RequiredArgsConstructor;
//
//@Configuration
//@EnableMethodSecurity
//@RequiredArgsConstructor
//public class SecurityConfig {
//
//    private final JwtAuthenticationFilter jwtAuthenticationFilter;
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(
//            AuthenticationConfiguration configuration) throws Exception {
//        return configuration.getAuthenticationManager();
//    }
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http)
//            throws Exception {
//
//        http
//            .csrf(csrf -> csrf.disable())
//
//            .sessionManagement(session ->
//                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//
//            .authorizeHttpRequests(auth -> auth
//
//                    // Public APIs
//                    .requestMatchers(
//                            "/api/v1/auth/login",
//                            "/api/v1/auth/register",
//                            "/api/v1/auth/forgot-password",
//                            "/api/v1/auth/verify-otp",
//                            "/swagger-ui/**",
//                            "/swagger-ui.html",
//                            "/v3/api-docs/**"
//                    ).permitAll()
//
//                    // Change password requires JWT
//                    .requestMatchers("/api/profile/change-password")
//                    .authenticated()
//
//                    // Other secured APIs
//                    .requestMatchers(
//                            "/api/profile/**",
//                            "/api/categories/**",
//                            "/api/organizations/**"
//                    ).authenticated()
//
//                    .anyRequest()
//                    .authenticated()
//            )
//
//            .addFilterBefore(
//                    jwtAuthenticationFilter,
//                    UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }
//}
//

package com.induspathfinder.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.induspathfinder.app.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http

            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth

            	    // =====================================================
            	    // PUBLIC
            	    // =====================================================

            	    .requestMatchers(
            	            "/api/v1/auth/login",
            	            "/api/v1/auth/register",
            	            "/api/v1/auth/forgot-password",
            	            "/api/v1/auth/verify-otp",
            	            "/api/v1/auth/reset-password",
            	            "/api/v1/organizations/create",
            	            "/api/v1/admin/categories/active",
            	            "/swagger-ui/**",
            	            "/swagger-ui.html",
            	            "/v3/api-docs/**"
            	    )
            	    .permitAll()

            	    // =====================================================
            	    // ADMIN ONLY
            	    // =====================================================

            	    .requestMatchers(
            	            "/api/v1/audit-logs/**",
            	            "/api/v1/dashboard/admin",
            	            "/api/v1/admin/categories/**"
            	    )
            	    .hasRole("ADMIN")

            	    // =====================================================
            	    // PROJECT MANAGER ONLY
            	    // =====================================================

            	    .requestMatchers(
            	            "/api/v1/dashboard/project-manager/**",
            	            "/api/v1/projects/**",
            	            "/api/v1/activities/**",
            	            "/api/v1/dependencies/**",
            	            "/api/v1/cpm/**",
            	            "/api/v1/float/**",
            	            "/api/v1/network/**",
            	            "/api/v1/reports/**"
            	    )
            	    .hasRole("PROJECT_MANAGER")

            	    // =====================================================
            	    // ADMIN + PROJECT MANAGER
            	    // =====================================================

            	    .requestMatchers(
            	            "/api/v1/profile/**",
            	            "/api/v1/notifications/**",
            	            "/api/v1/auth/change-password"
            	    )
            	    .hasAnyRole(
            	            "ADMIN",
            	            "PROJECT_MANAGER"
            	    )

            	    // =====================================================
            	    // EVERYTHING ELSE
            	    // =====================================================

            	    .anyRequest()
            	    .authenticated()
            	)

            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}



