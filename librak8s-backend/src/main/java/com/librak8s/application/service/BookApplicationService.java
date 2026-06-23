package com.librak8s.application.service;

import com.librak8s.application.dto.BookRequest;
import com.librak8s.application.dto.BookResponse;
import com.librak8s.domain.exception.BookNotFoundException;
import com.librak8s.domain.model.Book;
import com.librak8s.domain.port.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookApplicationService {

    private final BookRepository bookRepository;

    @Transactional(readOnly = true)
    public List<BookResponse> findAll() {
        return bookRepository.findAll().stream()
                .map(BookResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookResponse findById(Long id) {
        return bookRepository.findById(id)
                .map(BookResponse::from)
                .orElseThrow(() -> new BookNotFoundException(id));
    }

    @Transactional
    public BookResponse create(BookRequest request) {
        Book book = new Book(null, request.title(), request.author(), request.isbn(), request.availableCopies());
        return BookResponse.from(bookRepository.save(book));
    }

    @Transactional
    public void delete(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new BookNotFoundException(id);
        }
        bookRepository.deleteById(id);
    }
}
