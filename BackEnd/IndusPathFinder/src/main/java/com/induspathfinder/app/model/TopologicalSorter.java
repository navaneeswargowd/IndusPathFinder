	package com.induspathfinder.app.model;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Queue;

public class TopologicalSorter {

    /**
     * Performs Kahn's Algorithm
     * Returns activities in execution order
     */
    public static List<ActivityNode> sort(Map<Long, ActivityNode> graph) {

        Queue<ActivityNode> queue = new ArrayDeque<>();

        List<ActivityNode> sorted = new ArrayList<>();

        // Add all start activities
        for (ActivityNode node : graph.values()) {

            if (node.getIncoming() == 0) {
                queue.offer(node);
            }
        }

        while (!queue.isEmpty()) {

            ActivityNode current = queue.poll();

            sorted.add(current);

            for (Edge edge : current.getOutgoingEdges()) {

                ActivityNode next = edge.getDestination();

                next.setIncoming(next.getIncoming() - 1);

                if (next.getIncoming() == 0) {
                    queue.offer(next);
                }
            }
        }

        // Cycle Detection
        if (sorted.size() != graph.size()) {
            throw new RuntimeException(
                    "Cycle detected in dependency graph. CPM cannot be calculated.");
        }

        return sorted;
    }
}