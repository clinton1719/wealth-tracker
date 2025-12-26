package com.backend.wealth_tracker.config;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.backend.wealth_tracker.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.Instant;

@Component
public class SecurityFilter extends OncePerRequestFilter {
  private static final Logger LOGGER = LoggerFactory.getLogger(SecurityFilter.class);

  @Autowired TokenProvider tokenService;
  @Autowired UserRepository userRepository;

  @Override
  protected void doFilterInternal(
          @NonNull HttpServletRequest request,  @NonNull HttpServletResponse response,  @NonNull FilterChain filterChain)
      throws ServletException, IOException {
    var token = this.recoverToken(request);
    if (token != null) {
      LOGGER.atInfo().log("Processing request with token at: {}", Instant.now());
      try {
        var username = tokenService.validateToken(token);
        var user = userRepository.findByUsername(username);

        if (user == null) {
          LOGGER.atError().log("User not found for token");
          sendUnauthorizedResponse(response, "User not found");
          return;
        }

        var authentication =
            new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        LOGGER.atInfo().log("Token validated successfully for user: {}", user.getUsername());
      } catch (JWTVerificationException e) {
        LOGGER.atError().log("Token validation failed: {}", e.getMessage());
        sendUnauthorizedResponse(response, "Token expired or invalid: " + e.getMessage());
        return;
      }
    }
    filterChain.doFilter(request, response);
  }

  private void sendUnauthorizedResponse(HttpServletResponse response, String message)
      throws IOException {
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    response.setContentType("application/json");
    PrintWriter writer = response.getWriter();
    writer.write("{\"error\": \"" + message + "\"}");
    writer.flush();
  }

  private String recoverToken(HttpServletRequest request) {
    var authHeader = request.getHeader("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      logger.debug("No valid Authorization header found");
      return null;
    }
    return authHeader.replace("Bearer ", "");
  }
}
