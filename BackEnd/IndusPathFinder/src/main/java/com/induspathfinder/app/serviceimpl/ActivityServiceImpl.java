package com.induspathfinder.app.serviceimpl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.induspathfinder.app.aop.AuditAction;
import com.induspathfinder.app.dto.request.activity.ActivityDeleteRequestDto;
import com.induspathfinder.app.dto.request.activity.ActivityDetailsRequestDto;
import com.induspathfinder.app.dto.request.activity.ActivityRequestDto;
import com.induspathfinder.app.dto.request.activity.ActivitySearchRequestDto;
import com.induspathfinder.app.dto.request.activity.ActivityUpdateRequestDto;
import com.induspathfinder.app.dto.response.activity.ActivityDeleteResponseDto;
import com.induspathfinder.app.dto.response.activity.ActivityDetailsResponseDto;
import com.induspathfinder.app.dto.response.activity.ActivityResponseDto;
import com.induspathfinder.app.dto.response.activity.ActivitySearchResponseDto;
import com.induspathfinder.app.dto.response.activity.ActivityUpdateResponseDto;
import com.induspathfinder.app.entity.Activity;
import com.induspathfinder.app.entity.Project;
import com.induspathfinder.app.exception.BadRequestException;
import com.induspathfinder.app.exception.ResourceNotFoundException;
import com.induspathfinder.app.repository.ActivityRepository;
import com.induspathfinder.app.repository.DependencyRepository;
import com.induspathfinder.app.repository.ProjectRepository;
import com.induspathfinder.app.service.ActivityService;
import com.induspathfinder.app.specification.ActivitySpecification;
import com.induspathfinder.app.util.CurrentUserUtil;
import com.induspathfinder.app.util.PaginationUtil;



@Service
public class ActivityServiceImpl implements ActivityService {

	private final ActivityRepository activityRepository;
	private final ProjectRepository projectRepository;
	private final CurrentUserUtil currentUserUtil;
	private final DependencyRepository dependencyRepository;

	public ActivityServiceImpl(ActivityRepository activityRepository,
	                           ProjectRepository projectRepository,CurrentUserUtil currentUserUtil, DependencyRepository dependencyRepository) {
	    this.activityRepository = activityRepository;
	    this.projectRepository = projectRepository;
	    this.currentUserUtil = currentUserUtil;
	    this.dependencyRepository = dependencyRepository;
	}
	@Transactional
	@Override
	@AuditAction(
		    actionName = "CREATE_ACTIVITY",
		    actionScreen = "ACTIVITIES",
		    actionScreenId = "#result.actId",
		    userId = "@currentUserUtil.getCurrentUserId()",
		    username = "@currentUserUtil.getCurrentUserName()",
		    details = "Activity created successfully"
		)
	public ActivityResponseDto createActivity(ActivityRequestDto request) {

	    // Validate Project
	    Project project = projectRepository.findById(request.getProjectId())
	            .orElseThrow(() -> new ResourceNotFoundException(
	                    "Project not found with ID : " + request.getProjectId()));
	    if (activityRepository.existsByProjectProjectIdAndActNameIgnoreCase(
	            request.getProjectId(),
	            request.getActName())) {

	        throw new IllegalArgumentException(
	                "Activity Name already exists in this Project.");
	    }
	    // Validate Activity Dates
	    if (request.getStartDate().isAfter(request.getEndDate())) {
	        throw new IllegalArgumentException(
	                "Activity Start Date cannot be after End Date.");
	    }

	    // Validate Activity Dates within Project Dates
	    if (request.getStartDate().isBefore(project.getStartDate())
	            || request.getEndDate().isAfter(project.getEndDate())) {

	        throw new IllegalArgumentException(
	                "Activity dates must be within the Project duration.");
	    }
	 // Validate Duration
	    if (request.getDuration() <= 0) {
	        throw new IllegalArgumentException(
	                "Duration must be greater than 0.");
	    }
	    long calculatedDuration =
	            ChronoUnit.DAYS.between(
	                    request.getStartDate(),
	                    request.getEndDate()) + 1;

	    if (request.getDuration() != calculatedDuration) {
	        throw new IllegalArgumentException(
	                "Duration must match the number of days between Start Date and End Date.");
	    }

	    // Create Activity Entity
	    Activity activity = new Activity();

	    activity.setProject(project);
	    activity.setActName(request.getActName());
	    activity.setDescription(request.getDescription());
	    activity.setDuration(request.getDuration());
	    activity.setStartDate(request.getStartDate());
	    activity.setEndDate(request.getEndDate());
	    activity.setPriority(request.getPriority());
	    activity.setStatus(request.getStatus());

	 // Audit Fields
	    activity.setCreatedBy(currentUserUtil.getCurrentUserId());
	    activity.setCreatedOn(LocalDateTime.now());

	 // Temporary value because actCode is NOT NULL
	    activity.setActCode("TEMP");

	    Activity savedActivity = activityRepository.save(activity);

	    // Generate code using database-generated ID
	    savedActivity.setActCode(
	            String.format("ACT-%04d", savedActivity.getActId()));

	    savedActivity = activityRepository.save(savedActivity);

	    return mapToResponse(savedActivity);
	}
	

    @Override
    public Page<ActivitySearchResponseDto> searchActivities(ActivitySearchRequestDto request) {

    	Pageable pageable =
    	        PaginationUtil.getPageable(
    	                request.getPage(),
    	                request.getSize(),
    	                request.getSortBy(),
    	                request.getDirection());

        Specification<Activity> specification =
                ActivitySpecification.search(request);

        Page<Activity> activities =
                activityRepository.findAll(specification, pageable);

        return activities.map(this::mapToSearchResponse);
    }
    @Override
    public ActivityDetailsResponseDto getActivityDetails(ActivityDetailsRequestDto request) {

        Activity activity = activityRepository.findById(request.getActId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Activity not found with ID : "
                                        + request.getActId()));

        return mapToDetailsResponse(activity);
    }
    @Transactional
    @Override
    @AuditAction(
    	    actionName = "UPDATE_ACTIVITY",
    	    actionScreen = "ACTIVITIES",
    	    actionScreenId = "#actId",
    	    userId = "@currentUserUtil.getCurrentUserId()",
    	    username = "@currentUserUtil.getCurrentUserName()",
    	    details = "Activity updated successfully"
    	)
    public ActivityUpdateResponseDto updateActivity(ActivityUpdateRequestDto request) {

        Activity activity = activityRepository.findById(request.getActId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Activity not found with ID : " + request.getActId()));

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found with ID : " + request.getProjectId()));
        if (activityRepository
                .existsByProjectProjectIdAndActNameIgnoreCaseAndActIdNot(
                        request.getProjectId(),
                        request.getActName(),
                        request.getActId())) {

            throw new IllegalArgumentException(
                    "Activity Name already exists in this Project.");
        }

     // Validate Activity Dates
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new IllegalArgumentException(
                    "Activity Start Date cannot be after End Date.");
        }

        // Validate Activity Dates within Project Dates
        if (request.getStartDate().isBefore(project.getStartDate())
                || request.getEndDate().isAfter(project.getEndDate())) {

            throw new IllegalArgumentException(
                    "Activity dates must be within the Project duration.");
        }
        if (request.getDuration() <= 0) {
            throw new IllegalArgumentException(
                    "Duration must be greater than 0.");
        }
        long calculatedDuration =
                ChronoUnit.DAYS.between(
                        request.getStartDate(),
                        request.getEndDate()) + 1;

        if (request.getDuration() != calculatedDuration) {
            throw new IllegalArgumentException(
                    "Duration must match the number of days between Start Date and End Date.");
        }

        activity.setProject(project);
        activity.setActName(request.getActName());
        activity.setDescription(request.getDescription());
        activity.setDuration(request.getDuration());
        activity.setStartDate(request.getStartDate());
        activity.setEndDate(request.getEndDate());
        activity.setPriority(request.getPriority());
        activity.setStatus(request.getStatus());

        activity.setUpdatedBy(currentUserUtil.getCurrentUserId());
        activity.setUpdatedOn(LocalDateTime.now());

        Activity updatedActivity = activityRepository.save(activity);

        return mapToUpdateResponse(updatedActivity);
    }
    @Transactional
    @Override
    @AuditAction(
    	    actionName = "DELETE_ACTIVITY",
    	    actionScreen = "ACTIVITIES",
    	    actionScreenId = "#actId",
    	    userId = "@currentUserUtil.getCurrentUserId()",
    	    username = "@currentUserUtil.getCurrentUserName()",
    	    details = "Activity deleted successfully"
    	)
    public ActivityDeleteResponseDto deleteActivity(ActivityDeleteRequestDto request) {

        Activity activity = activityRepository.findById(request.getActId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Activity not found with ID : " + request.getActId()));
        

        boolean hasPredecessorDependencies =
                dependencyRepository
                        .existsByPredecessorActivityActId(
                                request.getActId());

        boolean hasSuccessorDependencies =
                dependencyRepository
                        .existsBySuccessorActivityActId(
                                request.getActId());

        if (hasPredecessorDependencies || hasSuccessorDependencies) {
            throw new BadRequestException(
                    "Activity cannot be deleted because it contains Dependencies. "
                    + "Please delete all dependencies first."
            );
        }


        activityRepository.delete(activity);

        return ActivityDeleteResponseDto.builder()
                .actId(request.getActId())
                .message("Activity deleted successfully.")
                .success(true)
                .build();
    }

    private ActivityResponseDto mapToResponse(Activity activity) {

        return ActivityResponseDto.builder()
                .actId(activity.getActId())
                .projectId(activity.getProject().getProjectId())
                .actCode(activity.getActCode())
                .actName(activity.getActName())
                .description(activity.getDescription())
                .duration(activity.getDuration())
                .startDate(activity.getStartDate())
                .endDate(activity.getEndDate())
                .priority(activity.getPriority())
                .status(activity.getStatus())
                .build();
    }

    private ActivitySearchResponseDto mapToSearchResponse(Activity activity) {

        return ActivitySearchResponseDto.builder()
                .actId(activity.getActId())
                .projectId(activity.getProject().getProjectId())
                .actCode(activity.getActCode())
                .actName(activity.getActName())
                .description(activity.getDescription())
                .duration(activity.getDuration())
                .startDate(activity.getStartDate())
                .endDate(activity.getEndDate())
                .priority(activity.getPriority())
                .status(activity.getStatus())
                .build();
    }
    private ActivityDetailsResponseDto mapToDetailsResponse(Activity activity) {

        return ActivityDetailsResponseDto.builder()
                .actId(activity.getActId())
                .projectId(activity.getProject().getProjectId())
                .actCode(activity.getActCode())
                .actName(activity.getActName())
                .description(activity.getDescription())
                .duration(activity.getDuration())
                .startDate(activity.getStartDate())
                .endDate(activity.getEndDate())
                .priority(activity.getPriority())
                .status(activity.getStatus())
                .build();
    }
    private ActivityUpdateResponseDto mapToUpdateResponse(Activity activity) {

        return ActivityUpdateResponseDto.builder()
                .actId(activity.getActId())
                .projectId(activity.getProject().getProjectId())
                .actCode(activity.getActCode())
                .actName(activity.getActName())
                .description(activity.getDescription())
                .duration(activity.getDuration())
                .startDate(activity.getStartDate())
                .endDate(activity.getEndDate())
                .priority(activity.getPriority())
                .status(activity.getStatus())
                .build();
    }

}