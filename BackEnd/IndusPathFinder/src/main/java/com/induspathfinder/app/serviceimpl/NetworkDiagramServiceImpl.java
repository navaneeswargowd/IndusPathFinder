package com.induspathfinder.app.serviceimpl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.induspathfinder.app.dto.response.NetworkDiagramDTO;
import com.induspathfinder.app.dto.response.NetworkEdgeDTO;
import com.induspathfinder.app.dto.response.NetworkNodeDTO;
import com.induspathfinder.app.entity.Activity;
import com.induspathfinder.app.entity.Dependency;
import com.induspathfinder.app.model.ActivityNode;
import com.induspathfinder.app.model.Edge;
import com.induspathfinder.app.model.GraphBuilder;
import com.induspathfinder.app.model.TopologicalSorter;
import com.induspathfinder.app.repository.ActivityRepository;
import com.induspathfinder.app.repository.DependencyRepository;
import com.induspathfinder.app.model.ForwardPass;
import com.induspathfinder.app.model.BackwardPass;
import com.induspathfinder.app.model.CriticalPathFinder;
import com.induspathfinder.app.model.FloatCalculator;
import com.induspathfinder.app.service.NetworkDiagramService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NetworkDiagramServiceImpl implements NetworkDiagramService {

    private final ActivityRepository activityRepository;

    private final DependencyRepository dependencyRepository;

//    @Override
//    public NetworkDiagramDTO generate(Long projectId) {
//
//        //-------------------------------------
//        // Load Database Data
//        //-------------------------------------
//
//        List<Activity> activities =
//                activityRepository.findByProjectProjectId(projectId);
//
//        List<Dependency> dependencies =
//                dependencyRepository.findByProject_ProjectId(projectId);
//
//        //-------------------------------------
//        // Build Graph
//        //-------------------------------------
//
//        GraphBuilder builder = new GraphBuilder();
//
//        Map<Long, ActivityNode> graph =
//                builder.buildGraph(activities, dependencies);
//
//        //-------------------------------------
//        // Topological Sort
//        //-------------------------------------
//
//        List<ActivityNode> sorted =
//                TopologicalSorter.sort(graph);
//
//        //-------------------------------------
//        // CPM Calculation
//        //-------------------------------------
//
//        ForwardPass.calculate(sorted);
//
//        BackwardPass.calculate(sorted);
//
//        FloatCalculator.calculate(sorted);
//        CriticalPathFinder.find(sorted);
//
//        //-------------------------------------
//        // Prepare Nodes
//        //-------------------------------------
//
//        List<NetworkNodeDTO> nodes = new ArrayList<>();
//
//        for (ActivityNode node : sorted) {
//
//            NetworkNodeDTO dto = new NetworkNodeDTO();
//
//            dto.setActivityId(node.getActivityId());
//
//            dto.setActivityCode(node.getActivityCode());
//
//            dto.setActivityName(node.getActivityName());
//
//            dto.setDuration(node.getDuration());
//
//            dto.setCritical(node.isCritical());
//
//            nodes.add(dto);
//        }
//
//        //-------------------------------------
//        // Prepare Edges
//        //-------------------------------------
//
//        List<NetworkEdgeDTO> edges = new ArrayList<>();
//
//        for (ActivityNode node : sorted) {
//
//            for (Edge edge : node.getOutgoingEdges()) {
//
//                NetworkEdgeDTO dto = new NetworkEdgeDTO();
//
//                dto.setFromActivityId(edge.getSource().getActivityId());
//
//                dto.setToActivityId(edge.getDestination().getActivityId());
//
//                dto.setDependencyType(
//                        edge.getDependencyType().name());
//
//                dto.setLag(edge.getLag());
//
//                edges.add(dto);
//            }
//        }
//
//        //-------------------------------------
//        // Final Response
//        //-------------------------------------
//
//        NetworkDiagramDTO response =
//                new NetworkDiagramDTO();
//
//        response.setNodes(nodes);
//
//        response.setEdges(edges);
//
//        return response;
//    }
    
    
    @Override
    @Transactional
    public NetworkDiagramDTO generate(Long projectId) {

        List<Activity> activities =
                activityRepository.findByProjectProjectId(projectId);

        if (activities.isEmpty()) {
            throw new RuntimeException(
                    "Activities not found for Project Id : " + projectId);
        }

        List<Dependency> dependencies =
                dependencyRepository.findByProject_ProjectId(projectId);

        Map<Long, ActivityNode> graph =
                GraphBuilder.buildGraph(
                        activities,
                        dependencies);

        List<ActivityNode> sorted =
                TopologicalSorter.sort(graph);

        ForwardPass.calculate(sorted);

        BackwardPass.calculate(sorted);

        FloatCalculator.calculate(sorted);

        CriticalPathFinder.find(sorted);

        List<NetworkNodeDTO> nodes =
                new ArrayList<>();

        for (ActivityNode node : sorted) {

            NetworkNodeDTO dto =
                    new NetworkNodeDTO();

            dto.setActivityId(
                    node.getActivityId());

            dto.setActivityCode(
                    node.getActivityCode());

            dto.setActivityName(
                    node.getActivityName());

            dto.setDuration(
                    node.getDuration());

            dto.setCritical(
                    node.isCritical());

            nodes.add(dto);
        }

        List<NetworkEdgeDTO> edges =
                new ArrayList<>();

        for (ActivityNode node : sorted) {

            for (Edge edge :
                    node.getOutgoingEdges()) {

                NetworkEdgeDTO dto =
                        new NetworkEdgeDTO();

                dto.setFromActivityId(
                        edge.getSource()
                                .getActivityId());

                dto.setToActivityId(
                        edge.getDestination()
                                .getActivityId());

                dto.setDependencyType(
                        edge.getDependencyType()
                                .name());

                dto.setLag(
                        edge.getLag());

                edges.add(dto);
            }
        }

        NetworkDiagramDTO response =
                new NetworkDiagramDTO();

        response.setNodes(nodes);
        response.setEdges(edges);

        return response;
    }
    @Override
    public List<NetworkDiagramDTO> generateNetworkDiagram(Long projectId) {

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
        CriticalPathFinder.find(sorted);

        List<NetworkNodeDTO> nodes = new ArrayList<>();

        for (ActivityNode node : sorted) {

            NetworkNodeDTO nodeDTO = new NetworkNodeDTO();

            nodeDTO.setActivityId(node.getActivityId());
            nodeDTO.setActivityCode(node.getActivityCode());
            nodeDTO.setActivityName(node.getActivityName());
            nodeDTO.setDuration(node.getDuration());
            nodeDTO.setCritical(node.isCritical());

            nodes.add(nodeDTO);
        }

        List<NetworkEdgeDTO> edges = new ArrayList<>();

        for (ActivityNode node : sorted) {

            for (Edge edge : node.getOutgoingEdges()) {

                NetworkEdgeDTO edgeDTO = new NetworkEdgeDTO();

                edgeDTO.setFromActivityId(edge.getSource().getActivityId());
                edgeDTO.setToActivityId(edge.getDestination().getActivityId());
                edgeDTO.setDependencyType(edge.getDependencyType().name());
                edgeDTO.setLag(edge.getLag());

                edges.add(edgeDTO);
            }
        }

        NetworkDiagramDTO diagram = new NetworkDiagramDTO();

        diagram.setNodes(nodes);
        diagram.setEdges(edges);

        List<NetworkDiagramDTO> response = new ArrayList<>();
        response.add(diagram);

        return response;
    }

}