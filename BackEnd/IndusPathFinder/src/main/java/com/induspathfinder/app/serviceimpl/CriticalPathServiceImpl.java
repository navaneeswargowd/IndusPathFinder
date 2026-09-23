package com.induspathfinder.app.serviceimpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.induspathfinder.app.aop.AuditAction;
import com.induspathfinder.app.dto.response.CriticalPathDTO;
import com.induspathfinder.app.entity.Activity;
import com.induspathfinder.app.entity.Dependency;
import com.induspathfinder.app.model.ActivityNode;
import com.induspathfinder.app.model.GraphBuilder;
import com.induspathfinder.app.model.TopologicalSorter;
import com.induspathfinder.app.repository.ActivityRepository;
import com.induspathfinder.app.repository.DependencyRepository;
import com.induspathfinder.app.model.ForwardPass;
import com.induspathfinder.app.model.BackwardPass;
import com.induspathfinder.app.model.FloatCalculator;
import com.induspathfinder.app.service.CriticalPathService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class CriticalPathServiceImpl implements CriticalPathService {

    private final ActivityRepository activityRepository;
    private final DependencyRepository dependencyRepository;

    @Override
    @Transactional
    @AuditAction(
        actionName = "CALCULATE_CRITICAL_PATH",
        actionScreen = "CRITICAL_PATH",
        actionScreenId = "#projectId",
        userId = "@currentUserUtil.getCurrentUserId()",
        username = "@currentUserUtil.getCurrentUserName()",
        details = "Critical path calculated successfully"
    )
    public List<CriticalPathDTO> getCriticalPath(Long projectId) {

        List<Activity> activities =
                activityRepository.findByProjectProjectId(projectId);

        List<Dependency> dependencies =
                dependencyRepository.findByProject_ProjectId(projectId);

        GraphBuilder builder = new GraphBuilder();

        Map<Long, ActivityNode> graph =
                builder.buildGraph(activities, dependencies);

        List<ActivityNode> sorted =
                TopologicalSorter.sort(graph);

        ForwardPass.calculate(sorted);

        BackwardPass.calculate(sorted);

        FloatCalculator.calculate(sorted);

        List<CriticalPathDTO> result = new ArrayList<>();

        for(ActivityNode node : sorted){

            if(node.isCritical()){

                CriticalPathDTO dto = new CriticalPathDTO();

                dto.setActivityId(node.getActivityId());
                dto.setActivityCode(node.getActivityCode());
                dto.setActivityName(node.getActivityName());

                dto.setDuration(node.getDuration());

                dto.setEarlyStart(node.getEarlyStart());
                dto.setEarlyFinish(node.getEarlyFinish());

                dto.setLateStart(node.getLateStart());
                dto.setLateFinish(node.getLateFinish());

                dto.setTotalFloat(node.getTotalFloat());

                dto.setCritical(node.isCritical());

                result.add(dto);

            }

        }

        return result;

    }

}