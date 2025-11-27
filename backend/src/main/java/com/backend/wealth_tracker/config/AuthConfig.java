package com.backend.wealth_tracker.config;

import com.backend.wealth_tracker.exception.SecurityConfigurationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

@Configuration
@EnableWebSecurity
public class AuthConfig {
  private static final Logger LOGGER = LoggerFactory.getLogger(AuthConfig.class);
  @Autowired SecurityFilter securityFilter;

  @Bean
  @SuppressWarnings("PMD.AvoidCatchingGenericException")
  SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) {
    try {
      return httpSecurity
          .csrf(AbstractHttpConfigurer::disable)
          .sessionManagement(
              session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
          .authorizeHttpRequests(
              authorize ->
                  authorize
                      .requestMatchers(HttpMethod.POST, "/api/v1/auth/*")
                      .permitAll()
                      .requestMatchers("/swagger-ui/**")
                      .permitAll()
                      .requestMatchers("/api-docs*/**")
                      .permitAll()
                      .requestMatchers(HttpMethod.POST, "/api/v1/admin*")
                      .hasRole("ADMIN")
                      .anyRequest()
                      .authenticated())
          .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
          .build();
    } catch (Exception e) {
      LOGGER.atError().log("Failed to build SecurityFilterChain bean", e);
      throw new SecurityConfigurationException("Failed to build SecurityFilterChain bean", e);
    }
  }

  @Bean
  @SuppressWarnings("PMD.AvoidCatchingGenericException")
  AuthenticationManager authenticationManager(
      AuthenticationConfiguration authenticationConfiguration) {
    try {
      return authenticationConfiguration.getAuthenticationManager();
    } catch (Exception e) {
      LOGGER.atError().log("Failed to get Authentication manager", e);
      throw new SecurityConfigurationException("ailed to get Authentication manager", e);
    }
  }

  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
