package com.librak8s.infrastructure.persistence;

import com.librak8s.domain.model.User;
import com.librak8s.domain.port.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UserRepositoryAdapter implements UserRepository {

    private final UserJpaRepository jpaRepository;

    @Override
    public Optional<User> findByUsername(String username) {
        return jpaRepository.findByUsername(username).map(this::toDomain);
    }

    @Override
    public User save(User user) {
        return toDomain(jpaRepository.save(toEntity(user)));
    }

    @Override
    public boolean existsByUsername(String username) {
        return jpaRepository.existsByUsername(username);
    }

    private User toDomain(UserEntity e) {
        return new User(e.getId(), e.getUsername(), e.getPassword(), e.getRole());
    }

    private UserEntity toEntity(User u) {
        return new UserEntity(u.getId(), u.getUsername(), u.getPassword(), u.getRole());
    }
}
