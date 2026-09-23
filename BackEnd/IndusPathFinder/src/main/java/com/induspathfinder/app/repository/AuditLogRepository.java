package com.induspathfinder.app.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.induspathfinder.app.entity.AuditLog;

public interface AuditLogRepository
        extends JpaRepository<AuditLog, Long>,
        JpaSpecificationExecutor<AuditLog> {

    List<AuditLog> findTop10ByOrderByActionDateDesc();

    List<AuditLog> findByUsernameIgnoreCaseOrderByActionDateDesc(
            String username);

    long countByActionDateBetween(
            LocalDateTime fromDate,
            LocalDateTime toDate);

    default List<AuditLog> findAllNewestFirst() {

        return findAll(
                Sort.by(
                        Sort.Direction.DESC,
                        "actionDate"));
    }
}