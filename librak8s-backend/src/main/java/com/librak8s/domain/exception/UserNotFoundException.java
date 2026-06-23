package com.librak8s.domain.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String username) {
        super("Utilisateur introuvable : " + username);
    }
}
