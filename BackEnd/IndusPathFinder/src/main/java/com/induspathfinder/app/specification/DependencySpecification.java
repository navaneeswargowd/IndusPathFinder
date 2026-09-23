package com.induspathfinder.app.specification;

import org.springframework.data.jpa.domain.Specification;

import com.induspathfinder.app.dto.request.dependency.DependencySearchRequestDto;
import com.induspathfinder.app.entity.Activity;
import com.induspathfinder.app.entity.Dependency;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

public class DependencySpecification {
	public static Specification<Dependency> search(
            DependencySearchRequestDto request) {

        return (root, query, cb) -> {

            Predicate predicate = cb.conjunction();

            // Filter by Project Id
            if (request.getProjectId() != null) {

                predicate = cb.and(
                        predicate,
                        cb.equal(
                                root.get("project").get("projectId"),
                                request.getProjectId()));
            }

            // Join with Predecessor Activity
            Join<Dependency, Activity> predecessorJoin =
                    root.join("predecessorActivity");

            // Filter by Predecessor Activity Name
            if (request.getPredecessorActivityName() != null
                    && !request.getPredecessorActivityName().isBlank()) {

                predicate = cb.and(
                        predicate,
                        cb.like(
                                cb.lower(predecessorJoin.get("actName")),
                                "%" + request.getPredecessorActivityName().toLowerCase() + "%"));
            }

            // Join with Successor Activity
            Join<Dependency, Activity> successorJoin =
                    root.join("successorActivity");

            // Filter by Successor Activity Name
            if (request.getSuccessorActivityName() != null
                    && !request.getSuccessorActivityName().isBlank()) {

                predicate = cb.and(
                        predicate,
                        cb.like(
                                cb.lower(successorJoin.get("actName")),
                                "%" + request.getSuccessorActivityName().toLowerCase() + "%"));
            }

            // Filter by Dependency Type
            if (request.getDependencyType() != null) {

                predicate = cb.and(
                        predicate,
                        cb.equal(
                                root.get("dependencyType"),
                                request.getDependencyType()));
            }

            return predicate;
        };
    }

}
