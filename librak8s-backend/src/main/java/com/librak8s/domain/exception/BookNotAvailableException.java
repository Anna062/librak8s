package com.librak8s.domain.exception;

public class BookNotAvailableException extends RuntimeException {
    public BookNotAvailableException(Long bookId) {
        super("Aucune copie disponible pour le livre id : " + bookId);
    }
}
