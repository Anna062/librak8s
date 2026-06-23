package com.librak8s.infrastructure.persistence;

import com.librak8s.domain.model.Book;
import com.librak8s.domain.port.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class BookRepositoryAdapter implements BookRepository {

    private final BookJpaRepository jpaRepository;

    @Override
    public List<Book> findAll() {
        return jpaRepository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<Book> findById(Long id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public Book save(Book book) {
        return toDomain(jpaRepository.save(toEntity(book)));
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return jpaRepository.existsById(id);
    }

    private Book toDomain(BookEntity e) {
        return new Book(e.getId(), e.getTitle(), e.getAuthor(), e.getIsbn(), e.getAvailableCopies());
    }

    private BookEntity toEntity(Book b) {
        return new BookEntity(b.getId(), b.getTitle(), b.getAuthor(), b.getIsbn(), b.getAvailableCopies());
    }
}
