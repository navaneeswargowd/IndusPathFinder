package com.induspathfinder.app.serviceimpl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.induspathfinder.app.aop.AuditAction;
import com.induspathfinder.app.dto.request.NotificationCreateRequest;
import com.induspathfinder.app.dto.request.project.ProjectDeleteRequestDto;
import com.induspathfinder.app.dto.request.project.ProjectDetailsRequestDto;
import com.induspathfinder.app.dto.request.project.ProjectRequestDto;
import com.induspathfinder.app.dto.request.project.ProjectSearchRequestDto;
import com.induspathfinder.app.dto.request.project.ProjectUpdateRequestDto;
import com.induspathfinder.app.dto.response.project.ProjectDeleteResponseDto;
import com.induspathfinder.app.dto.response.project.ProjectDetailsResponseDto;
import com.induspathfinder.app.dto.response.project.ProjectResponseDto;
import com.induspathfinder.app.dto.response.project.ProjectSearchResponseDto;
import com.induspathfinder.app.entity.Project;
import com.induspathfinder.app.entity.User;
import com.induspathfinder.app.exception.BadRequestException;
import com.induspathfinder.app.exception.ResourceNotFoundException;
import com.induspathfinder.app.mapper.ProjectMapper;
import com.induspathfinder.app.repository.ActivityRepository;
import com.induspathfinder.app.repository.ProjectRepository;
import com.induspathfinder.app.service.NotificationService;
import com.induspathfinder.app.service.ProjectService;
import com.induspathfinder.app.specification.ProjectSpecification;
import com.induspathfinder.app.util.CurrentUserUtil;
import com.induspathfinder.app.util.PaginationUtil;

@Service
public class ProjectServiceImpl implements ProjectService {

	private final ProjectRepository projectRepository;
	private final ProjectMapper projectMapper;
	private final NotificationService notificationService;
	private final CurrentUserUtil currentUserUtil;
	private final ActivityRepository activityRepository;

	public ProjectServiceImpl(ProjectRepository projectRepository, ProjectMapper projectMapper,
			NotificationService notificationService, CurrentUserUtil currentUserUtil, ActivityRepository activityRepository) {

		this.projectRepository = projectRepository;
		this.projectMapper = projectMapper;
		this.notificationService = notificationService;
		this.currentUserUtil = currentUserUtil;
		this.activityRepository = activityRepository;
		
	}
	// ===========================
	// CREATE PROJECT
	// ===========================

	@Override
	@Transactional
	@AuditAction(actionName = "CREATE_PROJECT", actionScreen = "PROJECTS", actionScreenId = "#result.projectId", userId = "@currentUserUtil.getCurrentUserId()", username = "@currentUserUtil.getCurrentUserName()", details = "Project created successfully")
	public ProjectResponseDto createProject(ProjectRequestDto request) {

		validateDuplicateProjectName(request.getProjectName());

		validateProjectDates(request.getStartDate(), request.getEndDate());

		/*
		 * Get the currently logged-in Project Manager. Do not trust userId coming
		 * directly from the frontend.
		 */
		Long currentUserId = currentUserUtil.getCurrentUserId();

		Project project = Project.builder().projectName(request.getProjectName()).description(request.getDescription())
				.startDate(request.getStartDate()).endDate(request.getEndDate()).status(request.getStatus())
				.priority(request.getPriority()).build();

		/*
		 * First save generates project_id.
		 */
		Project savedProject = projectRepository.save(project);

		/*
		 * Generate project code using the generated ID.
		 */
		savedProject.setProjectCode(generateProjectCode(savedProject.getProjectId()));

		savedProject.setCreatedBy(currentUserId);
		savedProject.setUser(currentUserUtil.getCurrentUser());
		savedProject.setOrganization(currentUserUtil.getCurrentUser().getOrganization());
		/*
		 * Second save updates project_code.
		 */
		savedProject = projectRepository.save(savedProject);

		/*
		 * Create notification only after the project has been saved successfully.
		 */
		NotificationCreateRequest notificationRequest = NotificationCreateRequest.builder().userId(currentUserId)
				.title("Project Created").message("Project " + savedProject.getProjectCode() + " - "
						+ savedProject.getProjectName() + " was created successfully.")
				.build();

		notificationService.createNotification(notificationRequest);

		return projectMapper.mapToResponse(savedProject);
	}
	// ===========================
	// GET ALL PROJECTS
	// ===========================

//    @Override
//    public List<ProjectResponseDto> getAllProjects() {
//
//        return projectRepository.findAll()
//                .stream()
//                .map(projectMapper::mapToResponse)
//                .collect(Collectors.toList());
//    }

	@Override
	public List<ProjectResponseDto> getAllProjects() {

		Long currentUserId = currentUserUtil.getCurrentUserId();

		List<Project> projects = projectRepository.findByUserUserId(currentUserId);

		List<ProjectResponseDto> responses = new ArrayList<>();

		for (Project project : projects) {

			ProjectResponseDto response = projectMapper.mapToResponse(project);

			responses.add(response);
		}

		return responses;
	}
	// ===========================
	// SEARCH PROJECTS
	// ===========================

//    @Override
//    public Page<ProjectSearchResponseDto> searchProjects(ProjectSearchRequestDto request) {
//
//        Pageable pageable = PaginationUtil.getPageable(
//                request.getPage(),
//                request.getSize(),
//                request.getSortBy(),
//                request.getDirection());
//
//        Specification<Project> specification =
//                ProjectSpecification.search(request);
//
//        return projectRepository.findAll(specification, pageable)
//                .map(projectMapper::mapToSearchResponse);
//    }

	@Override
	public Page<ProjectSearchResponseDto> searchProjects(ProjectSearchRequestDto request) {

		Pageable pageable = PaginationUtil.getPageable(request.getPage(), request.getSize(), request.getSortBy(),
				request.getDirection());

		Long currentUserId = currentUserUtil.getCurrentUserId();

		/*
		 * Logged-in user condition
		 */
		Specification<Project> userSpecification = (root, query, criteriaBuilder) -> criteriaBuilder
				.equal(root.get("user").get("userId"), currentUserId);

		/*
		 * Existing search conditions
		 */
		Specification<Project> searchSpecification = ProjectSpecification.search(request);

		/*
		 * user_id = current user AND search filters
		 */
		Specification<Project> finalSpecification = userSpecification.and(searchSpecification);

		return projectRepository.findAll(finalSpecification, pageable).map(projectMapper::mapToSearchResponse);
	}

	// ===========================
	// PROJECT DETAILS
	// ===========================

//    @Override
//    public ProjectDetailsResponseDto getProjectDetails(ProjectDetailsRequestDto request) {
//
//        Project project = projectRepository.findById(request.getProjectId())
//                .orElseThrow(() ->
//                        new ResourceNotFoundException(
//                                "Project not found with ID : "
//                                        + request.getProjectId()));
//
//        return projectMapper.mapToDetailsResponse(project);
//    }

	@Override
	public ProjectDetailsResponseDto getProjectDetails(ProjectDetailsRequestDto request) {

		Long currentUserId = currentUserUtil.getCurrentUserId();

		Project project = projectRepository.findByProjectIdAndUserUserId(request.getProjectId(), currentUserId)
				.orElseThrow(
						() -> new ResourceNotFoundException("Project not found with ID : " + request.getProjectId()));

		return projectMapper.mapToDetailsResponse(project);
	}
	// ===========================
	// UPDATE PROJECT
	// ===========================

//    @Override
//    @Transactional
//    @AuditAction(
//    	    actionName = "UPDATE_PROJECT",
//    	    actionScreen = "PROJECTS",
//    	    actionScreenId = "#projectId",
//    	    userId = "@currentUserUtil.getCurrentUserId()",
//    	    username = "@currentUserUtil.getCurrentUserName()",
//    	    details = "Project updated successfully"
//    	)
//    public ProjectResponseDto updateProject(ProjectUpdateRequestDto request) {
//
////        Project project = projectRepository.findById(request.getProjectId())
////                .orElseThrow(() ->
////                        new ResourceNotFoundException(
////                                "Project not found with ID : "
////                                        + request.getProjectId()));
////
////        validateDuplicateProjectName(
////                request.getProjectName(),
////                request.getProjectId());
////
////        validateProjectDates(
////                request.getStartDate(),
////                request.getEndDate());
////
////        project.setProjectName(request.getProjectName());
////        project.setDescription(request.getDescription());
////        project.setStartDate(request.getStartDate());
////        project.setEndDate(request.getEndDate());
////        project.setStatus(request.getStatus());
////        project.setPriority(request.getPriority());
////
////        Project updatedProject = projectRepository.save(project);
////
////        return projectMapper.mapToResponse(updatedProject);
//    
//
//    	    Project project = projectRepository
//    	            .findById(request.getProjectId())
//    	            .orElseThrow(() ->
//    	                    new ResourceNotFoundException(
//    	                            "Project not found"));
//
//    	    validateProjectDates(
//    	            request.getStartDate(),
//    	            request.getEndDate());
//    	    
//    	    User currentUser =
//    	            currentUserUtil.getCurrentUser();
//
//    	    project.setProjectName(request.getProjectName());
//    	    project.setDescription(request.getDescription());
//    	    project.setStartDate(request.getStartDate());
//    	    project.setEndDate(request.getEndDate());
//    	    project.setStatus(request.getStatus());
//    	    project.setPriority(request.getPriority());
//    	    project.setUpdatedBy(currentUserUtil.getCurrentUserId());
//
//    	    Project updatedProject =
//    	            projectRepository.save(project);
//
//    	    
//
//    	    notificationService.createNotification(
//    	            NotificationCreateRequest.builder()
//    	                    .userId(currentUser.getUserId())
//    	                    .title("Project Updated")
//    	                    .message(
//    	                            "Project "
//    	                            + updatedProject.getProjectCode()
//    	                            + " - "
//    	                            + updatedProject.getProjectName()
//    	                            + " was updated successfully.")
//    	                    .build());
//
//    	    return projectMapper.mapToResponse(updatedProject);
//  
//    }

	@Override
	@Transactional
	@AuditAction(actionName = "UPDATE_PROJECT", actionScreen = "PROJECTS", actionScreenId = "#request.projectId", userId = "@currentUserUtil.getCurrentUserId()", username = "@currentUserUtil.getCurrentUserName()", details = "Project updated successfully")
	public ProjectResponseDto updateProject(ProjectUpdateRequestDto request) {

		Long currentUserId = currentUserUtil.getCurrentUserId();

		Project project = projectRepository.findByProjectIdAndUserUserId(request.getProjectId(), currentUserId)
				.orElseThrow(() -> new ResourceNotFoundException("Project not found"));

		validateDuplicateProjectName(request.getProjectName(), request.getProjectId());

		validateProjectDates(request.getStartDate(), request.getEndDate());

		User currentUser = currentUserUtil.getCurrentUser();

		project.setProjectName(request.getProjectName());

		project.setDescription(request.getDescription());

		project.setStartDate(request.getStartDate());

		project.setEndDate(request.getEndDate());

		project.setStatus(request.getStatus());

		project.setPriority(request.getPriority());

		project.setUpdatedBy(currentUserId);

		Project updatedProject = projectRepository.save(project);

		notificationService.createNotification(NotificationCreateRequest.builder().userId(currentUser.getUserId())
				.title("Project Updated").message("Project " + updatedProject.getProjectCode() + " - "
						+ updatedProject.getProjectName() + " was updated successfully.")
				.build());

		return projectMapper.mapToResponse(updatedProject);
	}

	// ===========================
	// DELETE PROJECT
	// ===========================

//    @Override
//    @Transactional
//    @AuditAction(
//    	    actionName = "DELETE_PROJECT",
//    	    actionScreen = "PROJECTS",
//    	    actionScreenId = "#projectId",
//    	    userId = "@currentUserUtil.getCurrentUserId()",
//    	    username = "@currentUserUtil.getCurrentUserName()",
//    	    details = "Project deleted successfully"
//    	)
//    public ProjectDeleteResponseDto deleteProject(ProjectDeleteRequestDto request) {
//
//        Project project = projectRepository.findById(request.getProjectId())
//                .orElseThrow(() ->
//                        new ResourceNotFoundException(
//                                "Project not found with ID : "
//                                        + request.getProjectId()));
//
//        projectRepository.delete(project);
//
//        return ProjectDeleteResponseDto.builder()
//                .projectId(request.getProjectId())
//                .success(true)
//                .message("Project deleted successfully.")
//                .build();
//    }

	@Override
	@Transactional
	@AuditAction(actionName = "DELETE_PROJECT", actionScreen = "PROJECTS", actionScreenId = "#request.projectId", userId = "@currentUserUtil.getCurrentUserId()", username = "@currentUserUtil.getCurrentUserName()", details = "Project deleted successfully")
	public ProjectDeleteResponseDto deleteProject(ProjectDeleteRequestDto request) {

		Long currentUserId = currentUserUtil.getCurrentUserId();

		Project project = projectRepository.findByProjectIdAndUserUserId(request.getProjectId(), currentUserId)
				.orElseThrow(
						() -> new ResourceNotFoundException("Project not found with ID : " + request.getProjectId()));
		
		boolean hasActivities =
		        activityRepository.existsByProject_ProjectId(request.getProjectId());

		if (hasActivities) {
		    throw new BadRequestException(
		        "Project cannot be deleted because it contains activities. "
		        + "Please delete all activities first."
		    );
		}

		projectRepository.delete(project);

		return ProjectDeleteResponseDto.builder().projectId(request.getProjectId()).success(true)
				.message("Project deleted successfully.").build();
	}

	// ===========================
	// PRIVATE METHODS
	// ===========================

	private String generateProjectCode(Long projectId) {
		return String.format("PRJ%04d", projectId);
	}

	private void validateDuplicateProjectName(String projectName) {

		if (projectRepository.existsByProjectNameIgnoreCase(projectName)) {
			throw new IllegalArgumentException("Project Name already exists.");
		}
	}

	private void validateDuplicateProjectName(String projectName, Long projectId) {

		if (projectRepository.existsByProjectNameIgnoreCaseAndProjectIdNot(projectName, projectId)) {

			throw new IllegalArgumentException("Project Name already exists.");
		}
	}

	private void validateProjectDates(LocalDate startDate, LocalDate endDate) {

		if (startDate.isAfter(endDate)) {
			throw new IllegalArgumentException("Start Date cannot be after End Date.");
		}
	}
}