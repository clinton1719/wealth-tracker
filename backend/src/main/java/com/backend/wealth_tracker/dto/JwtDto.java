package com.backend.wealth_tracker.dto;

public class JwtDto {
    String accessToken;

    public JwtDto(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
}
