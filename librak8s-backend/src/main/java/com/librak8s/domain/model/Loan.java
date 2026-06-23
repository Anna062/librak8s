package com.librak8s.domain.model;

import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

/**
 * Agrégat Loan — entité pure, aucune dépendance vers Spring ou JPA.
 */
@Setter
@Getter
public class Loan {

    private Long id;
    private Long bookId;
    private String username;
    private LocalDate loanDate;
    private LocalDate returnDate;
    private LoanStatus status;
    
    public Loan(Long id, Long bookId, String username, LocalDate loanDate, LocalDate returnDate, LoanStatus status) {
        this.id = id;
        this.bookId = bookId;
        this.username = username;
        this.loanDate = loanDate;
        this.returnDate = returnDate;
        this.status = status;
    }

    public boolean isActive() {
        return LoanStatus.ACTIVE.equals(status);
    }

}
