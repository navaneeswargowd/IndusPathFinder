package com.induspathfinder.app.model;

import java.util.ArrayList;
import java.util.List;

public class CriticalPathFinder {

    /**
     * Returns all activities that belong to the Critical Path.
     */
    public static List<ActivityNode> find(List<ActivityNode> sortedActivities) {

        List<ActivityNode> criticalPath = new ArrayList<>();

        for (ActivityNode node : sortedActivities) {

            if (Boolean.TRUE.equals(node.isCritical())) {
                criticalPath.add(node);
            }

        }

        return criticalPath;
    }
}