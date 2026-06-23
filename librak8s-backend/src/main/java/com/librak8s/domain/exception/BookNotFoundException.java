package com.librak8s.domain.exception;

public class BookNotFoundException extends RuntimeException {
    public BookNotFoundException(Long id) {
        super("Livre introuvable avec l'id : " + id);
    }
}
