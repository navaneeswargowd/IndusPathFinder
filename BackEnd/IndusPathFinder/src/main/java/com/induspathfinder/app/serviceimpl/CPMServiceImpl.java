//package com.induspathfinder.app.serviceimpl;
//
//import java.util.*;
//
//import org.springframework.stereotype.Service;
//
//import com.induspathfinder.app.dto.response.CPMResultDTO;
//import com.induspathfinder.app.entity.Activity;
//import com.induspathfinder.app.entity.Dependency;
//import com.induspathfinder.app.repository.ActivityRepository;
//import com.induspathfinder.app.repository.DependencyRepository;
//import com.induspathfinder.app.service.CPMService;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//public class CPMServiceImpl implements CPMService {
//
//    private final ActivityRepository activityRepository;
//    private final DependencyRepository dependencyRepository;
//
//    @Override
//    public List<CPMResultDTO> calculateCPM(Long projectId) {
//
//        List<Activity> activities = activityRepository.findByProject_ProjectId(projectId);
//        List<Dependency> dependencies = dependencyRepository.findByProject_ProjectId(projectId);
//
//        Map<Long, CPMResultDTO> map = new LinkedHashMap<>();
//
//        for(Activity a : activities){
//
//            CPMResultDTO dto = new CPMResultDTO();
//
//            dto.setActivityId(a.getActivityId());
//            dto.setActivityCode(a.getActivityCode());
//            dto.setActivityName(a.getActivityName());
//            dto.setDuration(a.getDurationDays());
//
//            dto.setEarlyStart(0);
//            dto.setEarlyFinish(a.getDurationDays());
//
//            map.put(a.getActivityId(), dto);
//        }
//
//        boolean updated = true;
//
//        while(updated){
//
//            updated = false;
//
//            for(Dependency d : dependencies){
//
//                CPMResultDTO pre =
//                        map.get(d.getPredecessorActivity().getActivityId());
//
//                CPMResultDTO suc =
//                        map.get(d.getSuccessorActivity().getActivityId());
//
//                int es = pre.getEarlyFinish();
//
//                if(es > suc.getEarlyStart()){
//
//                    suc.setEarlyStart(es);
//                    suc.setEarlyFinish(es + suc.getDuration());
//
//                    updated = true;
//                }
//            }
//
//        }
//
//        int projectDuration = 0;
//
//        for(CPMResultDTO dto : map.values()){
//
//            projectDuration =
//                    Math.max(projectDuration,dto.getEarlyFinish());
//
//        }
//
//        List<CPMResultDTO> reverse =
//                new ArrayList<>(map.values());
//
//        Collections.reverse(reverse);
//
//        for(CPMResultDTO dto : reverse){
//
//            dto.setLateFinish(projectDuration);
//            dto.setLateStart(projectDuration - dto.getDuration());
//
//        }
//
//        updated = true;
//
//        while(updated){
//
//            updated = false;
//
//            for(int i=dependencies.size()-1;i>=0;i--){
//
//                Dependency d = dependencies.get(i);
//
//                CPMResultDTO pre =
//                        map.get(d.getPredecessorActivity().getActivityId());
//
//                CPMResultDTO suc =
//                        map.get(d.getSuccessorActivity().getActivityId());
//
//                int lf = suc.getLateStart();
//
//                if(pre.getLateFinish() > lf){
//
//                    pre.setLateFinish(lf);
//                    pre.setLateStart(lf - pre.getDuration());
//
//                    updated = true;
//                }
//
//            }
//
//        }
//
//        for(CPMResultDTO dto : map.values()){
//
//            int tf = dto.getLateStart()-dto.getEarlyStart();
//
//            dto.setTotalFloat(tf);
//
//            dto.setCritical(tf==0);
//
//        }
//
//        return new ArrayList<>(map.values());
//
//    }
//
//}


package com.induspathfinder.app.serviceimpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

//import com.induspathfinder.app.repository.ActivityRepository;
import com.induspathfinder.app.repository.DependencyRepository;
import com.induspathfinder.app.repository.ActivityRepository;
import com.induspathfinder.app.aop.AuditAction;
import com.induspathfinder.app.dto.request.NotificationCreateRequest;
import com.induspathfinder.app.dto.response.CPMResultDTO;
//import com.induspathfinder.app.entity.Activity;
//import com.induspathfinder.app.entity.Dependency;


import com.induspathfinder.app.entity.Activity;
import com.induspathfinder.app.entity.Dependency;
import com.induspathfinder.app.entity.User;
import com.induspathfinder.app.model.ActivityNode;
import com.induspathfinder.app.model.BackwardPass;
import com.induspathfinder.app.model.CriticalPathFinder;
import com.induspathfinder.app.model.FloatCalculator;
import com.induspathfinder.app.model.ForwardPass;
import com.induspathfinder.app.model.GraphBuilder;
import com.induspathfinder.app.model.TopologicalSorter;
//import com.induspathfinder.app.repository.ActivityRepository;
//import com.induspathfinder.app.repository.DependencyRepository;
import com.induspathfinder.app.service.CPMService;
import com.induspathfinder.app.util.CurrentUserUtil;

import jakarta.transaction.Transactional;

import com.induspathfinder.app.repository.DependencyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CPMServiceImpl implements CPMService {

    private final ActivityRepository activityRepository;

    private final DependencyRepository dependencyRepository;
    
    private final NotificationServiceImpl notificationService;
    
    private final CurrentUserUtil currentUserUtil;

    @Override
    @Transactional
    @AuditAction(
        actionName = "RUN_CPM_ANALYSIS",
        actionScreen = "CPM_ANALYSIS",
        actionScreenId = "#project",
        userId = "@currentUserUtil.getCurrentUserId()",
        username = "@currentUserUtil.getCurrentUserName()",
        details = "CPM analysis completed successfully"
    )
    public List<CPMResultDTO> calculateCPM(Long project) {

        // STEP-1
        List<Activity> activities =
                activityRepository.findByProjectProjectId(project);

        // STEP-2
        List<Dependency> dependencies =
                dependencyRepository.findByProject_ProjectId(project);

        if (activities.isEmpty()) {
            throw new RuntimeException("Activities not found.");
        }

        // STEP-3
        Map<Long, ActivityNode> graph =
                GraphBuilder.buildGraph(activities, dependencies);

        // STEP-4
        List<ActivityNode> sorted =
                TopologicalSorter.sort(graph);

        // STEP-5
        ForwardPass.calculate(sorted);

        // STEP-6
        BackwardPass.calculate(sorted);

        // STEP-7
        FloatCalculator.calculate(sorted);

        // STEP-8
        CriticalPathFinder.find(sorted);

        // STEP-9
        List<CPMResultDTO> result = new ArrayList<>();

        for (ActivityNode node : sorted) {

            CPMResultDTO dto = new CPMResultDTO();

            dto.setActivityId(node.getActivity().getActId());
            dto.setActivityCode(node.getActivity().getActCode());
            dto.setActivityName(node.getActivity().getActName());

            dto.setDuration(node.getDuration());

            dto.setEarlyStart(node.getEarlyStart());
            dto.setEarlyFinish(node.getEarlyFinish());

            dto.setLateStart(node.getLateStart());
            dto.setLateFinish(node.getLateFinish());


            dto.setCritical(node.isCritical());

            result.add(dto);
        }
        
        User currentUser =
                currentUserUtil.getCurrentUser();

        notificationService.createNotification(
                NotificationCreateRequest.builder()
                        .userId(currentUser.getUserId())
                        .title("CPM Analysis Completed")
                        .message(
                                "CPM analysis for Project ID "
                                + project
                                + " completed successfully.")
                        .build());

        return result;
    }

}