package com.librak8s.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BookJpaRepository extends JpaRepository<BookEntity, Long> {
}
