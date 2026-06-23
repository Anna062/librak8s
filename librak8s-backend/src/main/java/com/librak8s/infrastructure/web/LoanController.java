package com.librak8s.infrastructure.web;

import com.librak8s.application.dto.LoanRequest;
import com.librak8s.application.dto.LoanResponse;
import com.librak8s.application.service.LoanApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
@Tag(name = "Emprunts", description = "Gestion des emprunts")
@SecurityRequirement(name = "bearerAuth")
public class LoanController {

    private final LoanApplicationService loanService;

    @PostMapping
    @Operation(summary = "Emprunter un livre")
    public ResponseEntity<LoanResponse> borrow(
            @Valid @RequestBody LoanRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(loanService.borrow(userDetails.getUsername(), request));
    }

    @PutMapping("/{id}/return")
    @Operation(summary = "Retourner un livre")
    public ResponseEntity<LoanResponse> returnBook(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(loanService.returnBook(id, userDetails.getUsername()));
    }

    @GetMapping("/my")
    @Operation(summary = "Mes emprunts en cours")
    public ResponseEntity<List<LoanResponse>> myLoans(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        final List<LoanResponse> loans = loanService.findMyActiveLoans(userDetails.getUsername());
        return ResponseEntity.ok(loans);
    }
}
