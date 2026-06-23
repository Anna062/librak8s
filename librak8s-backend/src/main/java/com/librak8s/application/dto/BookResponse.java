package com.librak8s.application.dto;

import com.librak8s.domain.model.Book;

public record BookResponse(Long id, String title, String author, String isbn, int availableCopies) {

    public static BookResponse from(Book book) {
        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getIsbn(),
                book.getAvailableCopies()
        );
    }
}
