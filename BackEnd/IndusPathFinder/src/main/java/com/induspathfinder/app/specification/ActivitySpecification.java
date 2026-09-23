package com.induspathfinder.app.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.induspathfinder.app.dto.request.activity.ActivitySearchRequestDto;
import com.induspathfinder.app.entity.Activity;

import jakarta.persistence.criteria.Predicate;

public class ActivitySpecification {

    public static Specification<Activity> search(ActivitySearchRequestDto request) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            // Project ID
            if (request.getProjectId() != null) {
                predicates.add(
                    cb.equal(
                        root.get("project").get("projectId"),
                        request.getProjectId()));
            }

            // Activity Name
            if (request.getActName() != null &&
                !request.getActName().trim().isEmpty()) {

                predicates.add(
                    cb.like(
                        cb.lower(root.get("actName")),
                        "%" + request.getActName().toLowerCase() + "%"
                    ));
            }
            //Activity Code
            if (request.getActCode() != null && !request.getActCode().isBlank()) {
                predicates.add(
                    cb.like(
                        cb.lower(root.get("actCode")),
                        "%" + request.getActCode().toLowerCase() + "%"
                    )
                );
            }

            // Priority
            if (request.getPriority() != null) {
                predicates.add(
                    cb.equal(
                        root.get("priority"),
                        request.getPriority()));
            }

            // Status
            if (request.getStatus() != null) {
                predicates.add(
                    cb.equal(
                        root.get("status"),
                        request.getStatus()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}