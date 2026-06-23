package com.librak8s.application.service;

import com.librak8s.application.dto.LoanRequest;
import com.librak8s.application.dto.LoanResponse;
import com.librak8s.domain.exception.BookNotAvailableException;
import com.librak8s.domain.exception.BookNotFoundException;
import com.librak8s.domain.exception.ForbiddenOperationException;
import com.librak8s.domain.exception.LoanAlreadyReturnedException;
import com.librak8s.domain.exception.LoanNotFoundException;
import com.librak8s.domain.exception.UserNotFoundException;
import com.librak8s.domain.model.Book;
import com.librak8s.domain.model.Loan;
import com.librak8s.domain.model.LoanStatus;
import com.librak8s.domain.model.User;
import com.librak8s.domain.port.BookRepository;
import com.librak8s.domain.port.LoanRepository;
import com.librak8s.domain.port.UserRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanApplicationService {

    private final LoanRepository loanRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Transactional
    public LoanResponse borrow(String username, LoanRequest request) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        var book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new BookNotFoundException(request.bookId()));

        if (!book.isAvailable()) {
            throw new BookNotAvailableException(book.getId());
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        Loan loan = new Loan(null, book.getId(), user.getUsername(), LocalDate.now(), null, LoanStatus.ACTIVE);
        return LoanResponse.from(loanRepository.save(loan));
    }

    @Transactional
    public LoanResponse returnBook(Long loanId, String username) {
        final User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        final Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new LoanNotFoundException(loanId));

        if (!loan.getUsername().equals(user.getUsername())) {
            throw new ForbiddenOperationException("Cet emprunt ne vous appartient pas");
        }

        if (!loan.isActive()) {
            throw new LoanAlreadyReturnedException(loanId);
        }

        loan.setReturnDate(LocalDate.now());
        loan.setStatus(LoanStatus.RETURNED);

        final Book book = bookRepository.findById(loan.getBookId())
                .orElseThrow(() -> new BookNotFoundException(loan.getBookId()));
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        return LoanResponse.from(loanRepository.save(loan));
    }

    @Transactional(readOnly = true)
    public List<LoanResponse> findMyActiveLoans(String username) {
        final User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        return loanRepository.findByUsernameAndStatus(user.getUsername(), LoanStatus.ACTIVE)
                .stream()
                .map(LoanResponse::from)
                .toList();
    }
}
