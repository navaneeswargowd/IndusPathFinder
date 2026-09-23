package com.induspathfinder.app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.induspathfinder.app.entity.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long>,JpaSpecificationExecutor<Project>{
	
	
	boolean existsByProjectNameIgnoreCase(String projectName);
	boolean existsByProjectNameIgnoreCaseAndProjectIdNot(String projectName, Long projectId);
	
	List<Project> findByUserUserId(Long userId);
	
	Optional<Project> findByProjectIdAndUserUserId(
	        Long projectId,
	        Long userId);

}
