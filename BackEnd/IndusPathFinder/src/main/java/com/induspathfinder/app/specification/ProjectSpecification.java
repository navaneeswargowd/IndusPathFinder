package com.induspathfinder.app.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.induspathfinder.app.dto.request.project.ProjectSearchRequestDto;
import com.induspathfinder.app.entity.Project;

import jakarta.persistence.criteria.Predicate;

public class ProjectSpecification {

    public static Specification<Project> search(ProjectSearchRequestDto request) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            // Project Code
            if (request.getProjectCode() != null &&!request.getProjectCode().trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("projectCode")),"%" + request.getProjectCode().toLowerCase() + "%"));
            }

            // Project Name
            if (request.getProjectName() != null &&!request.getProjectName().trim().isEmpty()) {
            	predicates.add(cb.like(cb.lower(root.get("projectName")),"%" + request.getProjectName().toLowerCase() + "%"));
            }

            // Status
            if (request.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"),request.getStatus()));
            }
            if (request.getPriority() != null) {
                predicates.add(cb.equal(root.get("priority"), request.getPriority()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}