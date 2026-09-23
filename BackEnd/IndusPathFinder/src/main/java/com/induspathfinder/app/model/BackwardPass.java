package com.induspathfinder.app.model;

import java.util.Collections;
import java.util.List;

//import com.induspathfinder.app.entity.DependencyType;
import com.induspathfinder.app.enums.DependencyType;

public class BackwardPass {

    /**
     * Calculates
     * LS - Late Start
     * LF - Late Finish
     * Total Float
     */
    public static void calculate(List<ActivityNode> sortedActivities) {

        // Find Project Duration
        int projectDuration = 0;

        for (ActivityNode node : sortedActivities) {
            projectDuration = Math.max(projectDuration, node.getEarlyFinish());
        }

        // Reverse order
        Collections.reverse(sortedActivities);

        for (ActivityNode node : sortedActivities) {

            // End Activities
            if (node.getOutgoingEdges().isEmpty()) {

                node.setLateFinish(projectDuration);
                node.setLateStart(projectDuration - node.getDuration());

            } else {

                int lateFinish = Integer.MAX_VALUE;

                for (Edge edge : node.getOutgoingEdges()) {

                    ActivityNode successor = edge.getDestination();

                    int lag = edge.getLag();

                    int value = Integer.MAX_VALUE;

                    switch (edge.getDependencyType()) {

                        case FS:
                            value = successor.getLateStart() - lag;
                            break;

                        case SS:
                            value = successor.getLateStart() - lag + node.getDuration();
                            break;

                        case FF:
                            value = successor.getLateFinish() - lag;
                            break;

                        case SF:
                            value = successor.getLateFinish() - lag + node.getDuration();
                            break;
                    }

                    lateFinish = Math.min(lateFinish, value);
                }

                node.setLateFinish(lateFinish);
                node.setLateStart(lateFinish - node.getDuration());
            }

            // Total Float
            node.setTotalFloat(node.getLateStart() - node.getEarlyStart());

            // Critical Path
            node.setCritical(node.getTotalFloat() == 0);
        }

        // Restore original order
        Collections.reverse(sortedActivities);
    }
}