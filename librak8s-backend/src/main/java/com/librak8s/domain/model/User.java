package com.librak8s.domain.model;

import lombok.Getter;
import lombok.Setter;

/**
 * Agrégat User — entité pure, aucune dépendance vers Spring ou JPA.
 */
@Setter
@Getter
public class User {

    private Long id;
    private String username;
    private String password;
    private String role;

    public User() {}

    public User(Long id, String username, String password, String role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
    }

}
