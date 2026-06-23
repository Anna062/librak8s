package com.librak8s;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("dev")
class LibraK8sApplicationTests {

    @Test
    void contextLoads() {
        // Vérifie que le contexte Spring démarre sans erreur
    }
}
