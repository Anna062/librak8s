package com.librak8s.infrastructure.persistence;

import com.librak8s.domain.model.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanJpaRepository extends JpaRepository<LoanEntity, Long> {

    List<LoanEntity> findByUsername(String username);

    List<LoanEntity> findByUsernameAndStatus(String username, LoanStatus status);
}
