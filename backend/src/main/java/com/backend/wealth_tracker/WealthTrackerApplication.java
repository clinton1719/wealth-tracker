package com.backend.wealth_tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
@PropertySource(value = "file:${user.dir}/.env")
public final class WealthTrackerApplication {
  private WealthTrackerApplication() {}

  public static void main(String[] args) {
    SpringApplication.run(WealthTrackerApplication.class, args);
  }
  ;
}
