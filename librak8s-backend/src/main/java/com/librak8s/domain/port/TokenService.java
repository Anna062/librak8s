package com.librak8s.domain.port;

public interface TokenService {
    String generateToken(String username);
    long getExpiration();
}
