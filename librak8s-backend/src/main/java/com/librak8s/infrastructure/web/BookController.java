package com.librak8s.infrastructure.web;

import com.librak8s.application.dto.BookRequest;
import com.librak8s.application.dto.BookResponse;
import com.librak8s.application.service.BookApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Tag(name = "Livres", description = "Gestion du catalogue")
@SecurityRequirement(name = "bearerAuth")
public class BookController {

    private final BookApplicationService bookService;

    @GetMapping
    @Operation(summary = "Lister tous les livres")
    public ResponseEntity<List<BookResponse>> findAll() {
        return ResponseEntity.ok(bookService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Détail d'un livre")
    public ResponseEntity<BookResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Ajouter un livre [ROLE_ADMIN]")
    public ResponseEntity<BookResponse> create(@Valid @RequestBody BookRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookService.create(request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un livre [ROLE_ADMIN]")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
