package com.librak8s.application.dto;

public record LoginResponse(String token, String tokenType, long expiresIn) {

    public static LoginResponse of(String token, long expiresIn) {
        return new LoginResponse(token, "Bearer", expiresIn);
    }
}
