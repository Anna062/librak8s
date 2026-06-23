package com.librak8s;

import com.librak8s.domain.model.Book;
import com.librak8s.domain.model.User;
import com.librak8s.domain.port.BookRepository;
import com.librak8s.domain.port.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Log4j2
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedUsers();
        seedBooks();
    }

    private void seedUsers() {
        if (!userRepository.existsByUsername("admin")) {
            userRepository.save(new User(null, "admin",
                    passwordEncoder.encode("admin123"), "ROLE_ADMIN"));
            log.info("Utilisateur 'admin' créé");
        }
        if (!userRepository.existsByUsername("user")) {
            userRepository.save(new User(null, "user",
                    passwordEncoder.encode("user123"), "ROLE_USER"));
            log.info("Utilisateur 'user' créé");
        }
    }

    private void seedBooks() {
        if (!bookRepository.findAll().isEmpty()) return;

        bookRepository.save(new Book(null,
                "Clean Code",
                "Robert C. Martin",
                "978-0132350884",
                3));

        bookRepository.save(new Book(null,
                "The Pragmatic Programmer",
                "David Thomas & Andrew Hunt",
                "978-0135957059",
                2));

        bookRepository.save(new Book(null,
                "Kubernetes in Action",
                "Marko Luksa",
                "978-1617293726",
                1));

        log.info("3 livres de démo insérés");
    }
}
