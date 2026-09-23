package com.induspathfinder.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.induspathfinder.app.entity.Activity;
import com.induspathfinder.app.enums.ActivityPriority;
import com.induspathfinder.app.enums.ActivityStatus;

@Repository
public interface ActivityRepository extends JpaRepository <Activity, Long>, JpaSpecificationExecutor<Activity> {
	 List<Activity> findByProjectProjectId(Long projectId);

	    boolean existsByActCode(String actCode);
	    
	    //For filters
	    List<Activity> findByStatus(ActivityStatus status);

	    List<Activity> findByPriority(ActivityPriority priority);
	    
	    boolean existsByProjectProjectIdAndActCode(Long projectId,String actCode);
	    boolean existsByProjectProjectIdAndActNameIgnoreCase( Long projectId, String actName);
	    boolean existsByProjectProjectIdAndActNameIgnoreCaseAndActIdNot(Long projectId,String actName,Long actId);
	    
	    List<Activity>
	    findByProjectProjectIdOrderByActCodeAsc(
	            Long projectId);
	    
	    boolean existsByProject_ProjectId(Long projectId);
	   
}
