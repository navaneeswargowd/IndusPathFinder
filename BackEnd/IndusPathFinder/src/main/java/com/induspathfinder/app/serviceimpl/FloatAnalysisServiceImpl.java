package com.induspathfinder.app.serviceimpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.induspathfinder.app.aop.AuditAction;
import com.induspathfinder.app.dto.request.NotificationCreateRequest;
import com.induspathfinder.app.dto.response.FloatAnalysisDTO;
import com.induspathfinder.app.entity.Activity;
import com.induspathfinder.app.entity.Dependency;
import com.induspathfinder.app.entity.User;
import com.induspathfinder.app.model.ActivityNode;
import com.induspathfinder.app.model.BackwardPass;
import com.induspathfinder.app.model.FloatCalculator;
import com.induspathfinder.app.model.ForwardPass;
import com.induspathfinder.app.model.GraphBuilder;
import com.induspathfinder.app.model.TopologicalSorter;
import com.induspathfinder.app.repository.ActivityRepository;
import com.induspathfinder.app.repository.DependencyRepository;
import com.induspathfinder.app.service.FloatAnalysisService;
import com.induspathfinder.app.util.CurrentUserUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FloatAnalysisServiceImpl implements FloatAnalysisService {

    private final ActivityRepository activityRepository;

    private final DependencyRepository dependencyRepository;
    
   private final NotificationServiceImpl notificationService;
    
    private final CurrentUserUtil currentUserUtil;

    @Override
    @Transactional
    @AuditAction(
        actionName = "RUN_FLOAT_ANALYSIS",
        actionScreen = "FLOAT_ANALYSIS",
        actionScreenId = "#projectId",
        userId = "@currentUserUtil.getCurrentUserId()",
        username = "@currentUserUtil.getCurrentUserName()",
        details = "Float analysis completed successfully"
    )
    public List<FloatAnalysisDTO> runFloatAnalysis(Long projectId) {

        // Load Activities
        List<Activity> activities =
                activityRepository.findByProjectProjectId(projectId);

        if (activities.isEmpty()) {
            throw new RuntimeException("Activities not found for Project Id : " + projectId);
        }

        // Load Dependencies
        List<Dependency> dependencies =
                dependencyRepository.findByProject_ProjectId(projectId);

        // Build Activity Graph
        GraphBuilder builder = new GraphBuilder();

        Map<Long, ActivityNode> graph =
                builder.buildGraph(activities, dependencies);

        // Topological Sort
        List<ActivityNode> sortedActivities =
                TopologicalSorter.sort(graph);

        // Forward Pass
        ForwardPass.calculate(sortedActivities);

        // Backward Pass
        BackwardPass.calculate(sortedActivities);

        // Float Calculation
        FloatCalculator.calculate(sortedActivities);

        // Prepare Response
        List<FloatAnalysisDTO> response = new ArrayList<>();

        for (ActivityNode node : sortedActivities) {

            FloatAnalysisDTO dto = new FloatAnalysisDTO();

            dto.setActivityId(node.getActivityId());
            dto.setActivityCode(node.getActivityCode());
            dto.setActivityName(node.getActivityName());



            dto.setTotalFloat(node.getTotalFloat());
            dto.setFreeFloat(node.getFreeFloat());
            dto.setIndependentFloat(node.getIndependentFloat());

            dto.setCritical(node.isCritical());

            response.add(dto);
        }
        
        User currentUser =
                currentUserUtil.getCurrentUser();

        notificationService.createNotification(
                NotificationCreateRequest.builder()
                        .userId(currentUser.getUserId())
                        .title("Float Analysis Completed")
                        .message(
                                "Float analysis for Project ID "
                                + projectId
                                + " completed successfully.")
                        .build());

        return response;
    }

}