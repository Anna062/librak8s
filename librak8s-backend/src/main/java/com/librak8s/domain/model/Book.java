package com.librak8s.domain.model;

import lombok.Getter;
import lombok.Setter;

/**
 * Agrégat Book — entité pure, aucune dépendance vers Spring ou JPA.
 */
@Setter
@Getter
public class Book {

    private Long id;
    private String title;
    private String author;
    private String isbn;
    private int availableCopies;

    public Book() {}

    public Book(Long id, String title, String author, String isbn, int availableCopies) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.availableCopies = availableCopies;
    }

    public boolean isAvailable() {
        return availableCopies > 0;
    }
}
