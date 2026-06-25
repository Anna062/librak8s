package com.librak8s.application.service;

import com.librak8s.application.dto.LoginRequest;
import com.librak8s.application.dto.LoginResponse;
import com.librak8s.application.dto.RegisterRequest;
import com.librak8s.domain.exception.UserAlreadyExistsException;
import com.librak8s.domain.exception.UserNotFoundException;
import com.librak8s.domain.model.User;
import com.librak8s.domain.port.TokenService;
import com.librak8s.domain.port.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthApplicationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new UserAlreadyExistsException(request.username());
        }

        String role = normalizeRole(request.role());
        User user = new User(null, request.username(), passwordEncoder.encode(request.password()), role);
        userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {
        final String username = request.username();
        final User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, request.password())
        );

        String token = tokenService.generateToken(username);
        return LoginResponse.of(token, tokenService.getExpiration(), user.getRole(), username);
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) return "ROLE_USER";
        String upper = role.toUpperCase();
        return upper.startsWith("ROLE_") ? upper : "ROLE_" + upper;
    }
}
