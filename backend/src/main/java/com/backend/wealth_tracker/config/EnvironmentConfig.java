package com.backend.wealth_tracker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;

@Configuration
@Profile("!test")
@PropertySource(value = "file:${user.dir}/.env")
public class EnvironmentConfig {}
