package com.librak8s.domain.port;

import com.librak8s.domain.model.Loan;
import com.librak8s.domain.model.LoanStatus;

import java.util.List;
import java.util.Optional;

public interface LoanRepository {
    Loan save(Loan loan);
    Optional<Loan> findById(Long id);
    List<Loan> findByUsername(String username);
    List<Loan> findByUsernameAndStatus(String username, LoanStatus status);
}
