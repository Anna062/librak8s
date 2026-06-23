package com.librak8s.application.dto;

import com.librak8s.domain.model.Loan;

import java.time.LocalDate;

public record LoanResponse(
        Long id,
        Long bookId,
        String username,
        LocalDate loanDate,
        LocalDate returnDate,
        String status
) {
    public static LoanResponse from(Loan loan) {
        return new LoanResponse(
                loan.getId(),
                loan.getBookId(),
                loan.getUsername(),
                loan.getLoanDate(),
                loan.getReturnDate(),
                loan.getStatus().name()
        );
    }
}
