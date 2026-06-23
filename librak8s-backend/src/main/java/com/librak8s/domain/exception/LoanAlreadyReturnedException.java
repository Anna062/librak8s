package com.librak8s.domain.exception;

public class LoanAlreadyReturnedException extends RuntimeException {
    public LoanAlreadyReturnedException(Long id) {
        super("L'emprunt " + id + " a déjà été retourné");
    }
}
