package com.induspathfinder.app.specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.data.jpa.domain.Specification;

import com.induspathfinder.app.dto.request.AuditLogExportRequest;
import com.induspathfinder.app.dto.request.AuditLogSearchRequest;
import com.induspathfinder.app.entity.AuditLog;

import jakarta.persistence.criteria.Predicate;

public final class AuditLogSpecification {

    private AuditLogSpecification() {
        throw new IllegalStateException(
                "Specification class cannot be instantiated");
    }

    public static Specification<AuditLog> fromSearchRequest(
            AuditLogSearchRequest request) {

        return buildSpecification(
                request.getUserId(),
                request.getActionName(),
                request.getActionScreen(),
                request.getUsername(),
                request.getFromDate(),
                request.getToDate());
    }

    public static Specification<AuditLog> fromExportRequest(
            AuditLogExportRequest request) {

        return buildSpecification(
                request.getUserId(),
                request.getActionName(),
                request.getActionScreen(),
                request.getUsername(),
                request.getFromDate(),
                request.getToDate());
    }

    private static Specification<AuditLog> buildSpecification(
            Long userId,
            String actionName,
            String actionScreen,
            String username,
            java.time.LocalDateTime fromDate,
            java.time.LocalDateTime toDate) {

        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicates =
                    new ArrayList<>();

            if (userId != null) {

                predicates.add(
                        criteriaBuilder.equal(
                        		root.get("user").get("userId"),
                                userId));
            }

            if (actionName != null
                    && !actionName.isBlank()) {

                predicates.add(
                        containsIgnoreCase(
                                criteriaBuilder,
                                root.get("actionName"),
                                actionName));
            }

            if (actionScreen != null
                    && !actionScreen.isBlank()) {

                predicates.add(
                        containsIgnoreCase(
                                criteriaBuilder,
                                root.get("actionScreen"),
                                actionScreen));
            }

            if (username != null
                    && !username.isBlank()) {

                predicates.add(
                        containsIgnoreCase(
                                criteriaBuilder,
                                root.get("username"),
                                username));
            }

            if (fromDate != null) {

                predicates.add(
                        criteriaBuilder
                                .greaterThanOrEqualTo(
                                        root.get("actionDate"),
                                        fromDate));
            }

            if (toDate != null) {

                predicates.add(
                        criteriaBuilder
                                .lessThanOrEqualTo(
                                        root.get("actionDate"),
                                        toDate));
            }

            return criteriaBuilder.and(
                    predicates.toArray(
                            Predicate[]::new));
        };
    }

    private static Predicate containsIgnoreCase(
            jakarta.persistence.criteria.CriteriaBuilder
                    criteriaBuilder,
            jakarta.persistence.criteria.Path<String> field,
            String value) {

        String searchValue =
                "%"
                + value.trim()
                        .toLowerCase(Locale.ROOT)
                + "%";

        return criteriaBuilder.like(
                criteriaBuilder.lower(field),
                searchValue);
    }
}