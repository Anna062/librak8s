package com.librak8s.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Size(min = 3, max = 50, message = "Le username doit contenir entre 3 et 50 caractères") String username,
        @NotBlank @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères") String password,
        String role
) {}
