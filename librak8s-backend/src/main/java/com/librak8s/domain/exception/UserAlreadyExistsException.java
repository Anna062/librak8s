package com.librak8s.domain.exception;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String username) {
        super("L'utilisateur existe déjà : " + username);
    }
}
