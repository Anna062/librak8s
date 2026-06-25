package com.librak8s.application.dto;

import java.time.LocalDate;

public record LoginResponse(String token, String tokenType, long expiresIn,
                            String role, String username) {

    public static LoginResponse of(String token, long expiresIn, String role, String username) {
        return new LoginResponse(token, "Bearer", expiresIn, role, username);
    }
}
