package com.induspathfinder.app.serviceimpl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import com.induspathfinder.app.aop.AuditAction;
import com.induspathfinder.app.dto.request.dependency.DependencyDeleteRequestDto;
import com.induspathfinder.app.dto.request.dependency.DependencyDetailsRequestDto;
import com.induspathfinder.app.dto.request.dependency.DependencyRequestDto;
import com.induspathfinder.app.dto.request.dependency.DependencySearchRequestDto;
import com.induspathfinder.app.dto.request.dependency.DependencyUpdateRequestDto;
import com.induspathfinder.app.dto.response.dependency.DependencyDeleteResponseDto;
import com.induspathfinder.app.dto.response.dependency.DependencyDetailsResponseDto;
import com.induspathfinder.app.dto.response.dependency.DependencyResponseDto;
import com.induspathfinder.app.dto.response.dependency.DependencySearchResponseDto;
import com.induspathfinder.app.dto.response.dependency.DependencyUpdateResponseDto;
import com.induspathfinder.app.entity.Activity;
import com.induspathfinder.app.entity.Dependency;
import com.induspathfinder.app.entity.Project;
import com.induspathfinder.app.exception.DuplicateDependencyException;
import com.induspathfinder.app.exception.ResourceNotFoundException;
import com.induspathfinder.app.repository.ActivityRepository;
import com.induspathfinder.app.repository.DependencyRepository;
import com.induspathfinder.app.repository.ProjectRepository;
import com.induspathfinder.app.service.DependencyService;
import com.induspathfinder.app.specification.DependencySpecification;
import com.induspathfinder.app.util.CurrentUserUtil;
import com.induspathfinder.app.util.PaginationUtil;

@Service
public class DependencyServiceImpl implements DependencyService {

    private final DependencyRepository dependencyRepository;
    private final ProjectRepository projectRepository;
    private final ActivityRepository activityRepository;
    private final CurrentUserUtil currentUserUtil;

    public DependencyServiceImpl(
            DependencyRepository dependencyRepository,
            ProjectRepository projectRepository,
            ActivityRepository activityRepository,
            CurrentUserUtil currentUserUtil) {

        this.dependencyRepository = dependencyRepository;
        this.projectRepository = projectRepository;
        this.activityRepository = activityRepository;
        this.currentUserUtil = currentUserUtil;
    }
    @Transactional
    @Override
    @AuditAction(
    	    actionName = "CREATE_DEPENDENCY",
    	    actionScreen = "DEPENDENCIES",
    	    actionScreenId = "#result.dependencyId",
    	    userId = "@currentUserUtil.getCurrentUserId()",
    	    username = "@currentUserUtil.getCurrentUserName()",
    	    details = "Dependency created successfully"
    	)
    public DependencyResponseDto createDependency(DependencyRequestDto request) {

        // Validate all business rules
        validateDependency(request);

        // Fetch Project
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Project not found with ID : " + request.getProjectId()));

        // Fetch Predecessor Activity
        Activity predecessor = activityRepository
                .findById(request.getPredecessorActivityId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Predecessor Activity not found with ID : "
                                + request.getPredecessorActivityId()));

        // Fetch Successor Activity
        Activity successor = activityRepository
                .findById(request.getSuccessorActivityId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Successor Activity not found with ID : "
                                + request.getSuccessorActivityId()));

        // Create Dependency
        Dependency dependency = new Dependency();

        dependency.setProject(project);
        dependency.setPredecessorActivity(predecessor);
        dependency.setSuccessorActivity(successor);
        dependency.setDependencyType(request.getDependencyType());

        dependency.setCreatedBy(currentUserUtil.getCurrentUserId());
        dependency.setCreatedOn(LocalDateTime.now());

        Dependency savedDependency = dependencyRepository.save(dependency);

        return mapToResponse(savedDependency);
    }

    /**
     * Business Validations
     */
    private void validateDependency(DependencyRequestDto request) {

        validateProject(request.getProjectId());

        validateActivities(
                request.getPredecessorActivityId(),
                request.getSuccessorActivityId());

        validateSelfDependency(
                request.getPredecessorActivityId(),
                request.getSuccessorActivityId());

        validateSameProject(
                request.getProjectId(),
                request.getPredecessorActivityId(),
                request.getSuccessorActivityId());

        validateDuplicateDependency(
                request.getPredecessorActivityId(),
                request.getSuccessorActivityId());
    }

    /**
     * Project Validation
     */
    private void validateProject(Long projectId) {

        if (!projectRepository.existsById(projectId)) {

            throw new ResourceNotFoundException(
                    "Project not found with ID : " + projectId);
        }
    }

    /**
     * Activity Validation
     */
    private void validateActivities(Long predecessorId, Long successorId) {

        if (!activityRepository.existsById(predecessorId)) {

            throw new ResourceNotFoundException(
                    "Predecessor Activity not found with ID : "
                            + predecessorId);
        }

        if (!activityRepository.existsById(successorId)) {

            throw new ResourceNotFoundException(
                    "Successor Activity not found with ID : "
                            + successorId);
        }
    }

    /**
     * Self Dependency Validation
     */
    private void validateSelfDependency(Long predecessorId,
                                        Long successorId) {

        if (predecessorId.equals(successorId)) {

            throw new IllegalArgumentException(
                    "An activity cannot depend on itself.");
        }
    }

    /**
     * Same Project Validation
     */
    private void validateSameProject(Long projectId,
            Long predecessorId,
            Long successorId) {

Activity predecessor = activityRepository.findById(predecessorId)
.orElseThrow(() -> new ResourceNotFoundException(
"Predecessor Activity not found with ID : " + predecessorId));

Activity successor = activityRepository.findById(successorId)
.orElseThrow(() -> new ResourceNotFoundException(
"Successor Activity not found with ID : " + successorId));

if (!predecessor.getProject().getProjectId().equals(projectId)) {
throw new IllegalArgumentException(
"Predecessor Activity does not belong to selected project.");
}

if (!successor.getProject().getProjectId().equals(projectId)) {
throw new IllegalArgumentException(
"Successor Activity does not belong to selected project.");
}
}

    /**
     * Duplicate Dependency Validation
     */
    private void validateDuplicateDependency(Long predecessorId,
                                             Long successorId) {

        boolean exists = dependencyRepository
                .existsByPredecessorActivityActIdAndSuccessorActivityActId(
                        predecessorId,
                        successorId);

        if (exists) {

            throw new DuplicateDependencyException(
                    "Dependency already exists between these activities.");
        }
    }

    /**
     * Entity -> Response DTO
     */
    private DependencyResponseDto mapToResponse(Dependency dependency) {

        return DependencyResponseDto.builder()
                .dependencyId(dependency.getDependencyId())
                .projectId(dependency.getProject().getProjectId())
                .predecessorActivityId(
                        dependency.getPredecessorActivity().getActId())
                .predecessorActivityName(
                        dependency.getPredecessorActivity().getActName())
                .successorActivityId(
                        dependency.getSuccessorActivity().getActId())
                .successorActivityName(
                        dependency.getSuccessorActivity().getActName())
                .dependencyType(dependency.getDependencyType())
                .build();
    }
    @Override
    @Transactional(readOnly = true)
    public DependencyDetailsResponseDto getDependencyDetails(
            DependencyDetailsRequestDto request) {

        Dependency dependency = dependencyRepository
                .findById(request.getDependencyId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Dependency not found with ID : "
                                        + request.getDependencyId()));

        return mapToDetailsResponse(dependency);
    }
    private DependencyDetailsResponseDto mapToDetailsResponse(
            Dependency dependency) {

        return DependencyDetailsResponseDto.builder()

                .dependencyId(dependency.getDependencyId())

                .projectId(dependency.getProject().getProjectId())

                .predecessorActivityId(
                        dependency.getPredecessorActivity().getActId())

                .predecessorActivityName(
                        dependency.getPredecessorActivity().getActName())

                .successorActivityId(
                        dependency.getSuccessorActivity().getActId())

                .successorActivityName(
                        dependency.getSuccessorActivity().getActName())

                .dependencyType(dependency.getDependencyType())

                .createdBy(dependency.getCreatedBy())

                .createdOn(dependency.getCreatedOn())

                .updatedBy(dependency.getUpdatedBy())

                .updatedOn(dependency.getUpdatedOn())

                .build();
    }
    @Override
    @Transactional(readOnly = true)
    public Page<DependencySearchResponseDto> searchDependencies(
            DependencySearchRequestDto request) {

        Pageable pageable =
                PaginationUtil.getPageable(
                        request.getPage(),
                        request.getSize(),
                        request.getSortBy(),
                        request.getDirection());

        Specification<Dependency> specification =
                DependencySpecification.search(request);

        Page<Dependency> dependencies =
                dependencyRepository.findAll(specification, pageable);

        return dependencies.map(this::mapToSearchResponse);
    }
    private DependencySearchResponseDto mapToSearchResponse(
            Dependency dependency) {

        return DependencySearchResponseDto.builder()
                .dependencyId(dependency.getDependencyId())
                .projectId(dependency.getProject().getProjectId())
                .predecessorActivityName(
                        dependency.getPredecessorActivity().getActName())
                .successorActivityName(
                        dependency.getSuccessorActivity().getActName())
                .dependencyType(dependency.getDependencyType())
                .build();
    }
    @Transactional
    @Override
    @AuditAction(
    	    actionName = "UPDATE_DEPENDENCY",
    	    actionScreen = "DEPENDENCIES",
    	    actionScreenId = "#request.dependencyId",
    	    userId = "@currentUserUtil.getCurrentUserId()",
    	    username = "@currentUserUtil.getCurrentUserName()",
    	    details = "Dependency updated successfully"
    	)
    public DependencyUpdateResponseDto updateDependency(
            DependencyUpdateRequestDto request) {

        // Step 1: Find existing dependency
        Dependency dependency = dependencyRepository.findById(request.getDependencyId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Dependency not found with ID : " + request.getDependencyId()));

        // Step 2: Perform validations
        validateUpdateDependency(request, dependency);

        // Step 3: Load new activities
        Activity predecessor = activityRepository.findById(
                request.getPredecessorActivityId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Predecessor Activity not found"));

        Activity successor = activityRepository.findById(
                request.getSuccessorActivityId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Successor Activity not found"));

        // Step 4: Update entity
        dependency.setPredecessorActivity(predecessor);
        dependency.setSuccessorActivity(successor);
        dependency.setDependencyType(request.getDependencyType());

        dependency.setUpdatedBy(currentUserUtil.getCurrentUserId());
        dependency.setUpdatedOn(LocalDateTime.now());

        // Step 5: Save
        Dependency updatedDependency = dependencyRepository.save(dependency);

        // Step 6: Return response
        return mapToUpdateResponse(updatedDependency);
    }
    private void validateUpdateDependency(
            DependencyUpdateRequestDto request,
            Dependency dependency) {

        validateActivities(
                request.getPredecessorActivityId(),
                request.getSuccessorActivityId());

        validateSelfDependency(
                request.getPredecessorActivityId(),
                request.getSuccessorActivityId());

        validateSameProject(
                dependency.getProject().getProjectId(),
                request.getPredecessorActivityId(),
                request.getSuccessorActivityId());

        validateDuplicateDependencyForUpdate(
                request.getDependencyId(),
                request.getPredecessorActivityId(),
                request.getSuccessorActivityId());
    }
    private void validateDuplicateDependencyForUpdate(
            Long dependencyId,
            Long predecessorId,
            Long successorId) {

        boolean exists = dependencyRepository
                .existsByPredecessorActivityActIdAndSuccessorActivityActIdAndDependencyIdNot(
                        predecessorId,
                        successorId,
                        dependencyId);

        if (exists) {
            throw new DuplicateDependencyException(
                    "Dependency already exists between these activities.");
        }
        }
    
    private DependencyUpdateResponseDto mapToUpdateResponse(
            Dependency dependency) {

        return DependencyUpdateResponseDto.builder()

                .dependencyId(dependency.getDependencyId())

                .projectId(dependency.getProject().getProjectId())

                .predecessorActivityId(
                        dependency.getPredecessorActivity().getActId())

                .predecessorActivityName(
                        dependency.getPredecessorActivity().getActName())

                .successorActivityId(
                        dependency.getSuccessorActivity().getActId())

                .successorActivityName(
                        dependency.getSuccessorActivity().getActName())

                .dependencyType(
                        dependency.getDependencyType())

                .build();
    }
    @Transactional
    @Override
    @AuditAction(
    	    actionName = "DELETE_DEPENDENCY",
    	    actionScreen = "DEPENDENCIES",
    	    actionScreenId = "#dependencyId",
    	    userId = "@currentUserUtil.getCurrentUserId()",
    	    username = "@currentUserUtil.getCurrentUserName()",
    	    details = "Dependency deleted successfully"
    	)
    public DependencyDeleteResponseDto deleteDependency(
            DependencyDeleteRequestDto request) {

        Dependency dependency = dependencyRepository.findById(request.getDependencyId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Dependency not found with ID : " + request.getDependencyId()));

        dependencyRepository.delete(dependency);

        return DependencyDeleteResponseDto.builder()
                .dependencyId(request.getDependencyId())
                .message("Dependency deleted successfully.")
                .success(true)
                .build();
    }
    
}
