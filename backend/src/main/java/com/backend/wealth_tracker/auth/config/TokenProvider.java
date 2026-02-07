package com.backend.wealth_tracker.auth.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.backend.wealth_tracker.exception.SecurityConfigurationException;
import com.backend.wealth_tracker.auth.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class TokenProvider {
  private static final Logger LOGGER = LoggerFactory.getLogger(TokenProvider.class);

  @Value("${security.jwt.token.secret.key}")
  private String jwtSecret;

  public String generateAccessToken(User user) {
    try {
      Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
      return JWT.create()
          .withSubject(user.getUsername())
          .withClaim("username", user.getUsername())
          .withExpiresAt(genAccessExpirationDate())
          .sign(algorithm);
    } catch (JWTCreationException exception) {
      throw new JWTCreationException("Error while generating token", exception);
    }
  }

  @SuppressWarnings({"PMD.AvoidCatchingGenericException", "PMD.ExceptionAsFlowControl"})
  public String validateToken(String token) {
    try {
      Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
      var decodedToken = JWT.require(algorithm).acceptExpiresAt(0).build().verify(token);

      Instant expiresAt = decodedToken.getExpiresAt().toInstant();
      if (Instant.now().isAfter(expiresAt)) {
        throw new JWTVerificationException("Token has expired at " + expiresAt);
      }

      return decodedToken.getSubject();
    } catch (Exception exception) {
      throw new SecurityConfigurationException("Error while validating token", exception);
    }
  }

  public String extractUsername(String token) {
    try {
      Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
      var decodedToken = JWT.require(algorithm).acceptExpiresAt(0).build().verify(token);
      return decodedToken.getClaim("username").asString();
    } catch (JWTVerificationException jwtVerificationException) {
      throw new JWTVerificationException(
          "Error while extracting username from token", jwtVerificationException);
    }
  }

  private Instant genAccessExpirationDate() {
    Instant now = Instant.now();
    Instant expiresAt = now.plusSeconds(60L * 60L * 24L);
    LOGGER.atInfo().log("Token generated at: {}, expires at: {}", now, expiresAt);
    return expiresAt;
  }
}
