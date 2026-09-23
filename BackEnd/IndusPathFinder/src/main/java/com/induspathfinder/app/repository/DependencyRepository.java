package com.induspathfinder.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.induspathfinder.app.entity.Dependency;

public interface DependencyRepository extends JpaRepository<Dependency, Long>,
        JpaSpecificationExecutor<Dependency> {

    boolean existsByPredecessorActivityActIdAndSuccessorActivityActId(
            Long predecessorId,
            Long successorId);
    boolean existsByPredecessorActivityActIdAndSuccessorActivityActIdAndDependencyIdNot(
            Long predecessorActivityId,
            Long successorActivityId,
            Long dependencyId);
    List<Dependency> findByPredecessorActivityActId(Long predecessorActivityId);
    List<Dependency> findByProject_ProjectId(Long projectId);
    List<Dependency>
    findByProjectProjectIdOrderByDependencyIdAsc(
            Long projectId);
    
    boolean existsByPredecessorActivityActId(Long activityId);

    boolean existsBySuccessorActivityActId(Long activityId);
}