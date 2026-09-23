	package com.induspathfinder.app.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.induspathfinder.app.entity.Activity;
import com.induspathfinder.app.entity.Dependency;

public class GraphBuilder {

    /**
     * Convert Activities and Dependencies into ActivityNode Graph
     */
    public static Map<Long, ActivityNode> buildGraph(
            List<Activity> activities,
            List<Dependency> dependencies) {

        Map<Long, ActivityNode> nodeMap = new HashMap<>();

        // Create nodes
        for (Activity activity : activities) {

            ActivityNode node = new ActivityNode();

            node.setActivity(activity);
            node.setIncoming(0);

            nodeMap.put(activity.getActId(), node);
        }

        // Create edges
        for (Dependency dependency : dependencies) {

            ActivityNode predecessor =
                    nodeMap.get(dependency.getPredecessorActivity().getActId());

            ActivityNode successor =
                    nodeMap.get(dependency.getSuccessorActivity().getActId());

            Edge edge = new Edge();

            edge.setSource(predecessor);
            edge.setDestination(successor);
            edge.setDependencyType(dependency.getDependencyType());
//            edge.setLag(
//                    dependency.getLagDays() == null
//                            ? 0
//                            : dependency.getLagDays());

            predecessor.getOutgoingEdges().add(edge);
            successor.getIncomingEdges().add(edge);

            successor.setIncoming(successor.getIncoming() + 1);
        }

        return nodeMap;
    }
}