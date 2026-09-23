package com.induspathfinder.app.specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.data.jpa.domain.Specification;

import com.induspathfinder.app.dto.request.NotificationSearchRequest;
import com.induspathfinder.app.entity.Notification;

import jakarta.persistence.criteria.Predicate;

public final class NotificationSpecification {

    private NotificationSpecification() {
        throw new IllegalStateException(
                "Specification class cannot be instantiated");
    }

    public static Specification<Notification> fromRequest(
            NotificationSearchRequest request) {

        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicates =
                    new ArrayList<>();

            if (request.getUserId() != null) {

                predicates.add(
                        criteriaBuilder.equal(
                                root.get("user")
                                        .get("userId"),
                                request.getUserId()));
            }

            if (request.getTitle() != null
                    && !request.getTitle().isBlank()) {

                String searchTitle =
                        "%"
                        + request.getTitle()
                                .trim()
                                .toLowerCase(Locale.ROOT)
                        + "%";

                predicates.add(
                        criteriaBuilder.like(
                                criteriaBuilder.lower(
                                        root.get("title")),
                                searchTitle));
            }

            if (request.getStatus() != null) {

                predicates.add(
                        criteriaBuilder.equal(
                                root.get("status"),
                                request.getStatus()));
            }

            return criteriaBuilder.and(
                    predicates.toArray(
                            Predicate[]::new));
        };
    }
}