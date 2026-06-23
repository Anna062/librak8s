package com.librak8s.application.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BookRequest(
        @NotBlank(message = "Le titre est obligatoire") String title,
        @NotBlank(message = "L'auteur est obligatoire") String author,
        @NotBlank(message = "L'ISBN est obligatoire") String isbn,
        @NotNull @Min(value = 0, message = "Le nombre de copies ne peut pas être négatif") Integer availableCopies
) {}
