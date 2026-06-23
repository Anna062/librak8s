package com.librak8s.infrastructure.persistence;

import com.librak8s.domain.model.Loan;
import com.librak8s.domain.model.LoanStatus;
import com.librak8s.domain.port.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class LoanRepositoryAdapter implements LoanRepository {

    private final LoanJpaRepository jpaRepository;

    @Override
    public Loan save(Loan loan) {
        return toDomain(jpaRepository.save(toEntity(loan)));
    }

    @Override
    public Optional<Loan> findById(Long id) {
        return jpaRepository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Loan> findByUsername(String username) {
        return jpaRepository.findByUsername(username).stream().map(this::toDomain).toList();
    }

    @Override
    public List<Loan> findByUsernameAndStatus(String username, LoanStatus status) {
        return jpaRepository.findByUsernameAndStatus(username, status).stream().map(this::toDomain).toList();
    }

    private Loan toDomain(LoanEntity e) {
        return new Loan(e.getId(), e.getBookId(), e.getUsername(), e.getLoanDate(), e.getReturnDate(), e.getStatus());
    }

    private LoanEntity toEntity(Loan l) {
        return new LoanEntity(l.getId(), l.getBookId(), l.getUsername(), l.getLoanDate(), l.getReturnDate(), l.getStatus());
    }
}
