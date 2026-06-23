package com.librak8s.application.dto;

import jakarta.validation.constraints.NotNull;

public record LoanRequest(
        @NotNull(message = "L'identifiant du livre est obligatoire") Long bookId
) {}
