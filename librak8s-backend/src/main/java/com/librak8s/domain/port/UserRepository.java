package com.librak8s.domain.port;

import com.librak8s.domain.model.User;

import java.util.Optional;

public interface UserRepository {
    Optional<User> findByUsername(String username);
    User save(User user);
    boolean existsByUsername(String username);
}
