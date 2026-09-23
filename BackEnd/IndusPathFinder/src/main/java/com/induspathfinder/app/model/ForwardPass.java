package com.induspathfinder.app.model;

import java.util.List;


import com.induspathfinder.app.enums.DependencyType;

public class ForwardPass {

    /**
     * Calculates Early Start (ES) and Early Finish (EF)
     */
    public static void calculate(List<ActivityNode> sortedActivities) {

        for (ActivityNode node : sortedActivities) {

            // Start activities
            if (node.getIncomingEdges().isEmpty()) {

                node.setEarlyStart(0);
                node.setEarlyFinish(node.getDuration());

                continue;
            }

            int earlyStart = 0;

            for (Edge edge : node.getIncomingEdges()) {

                ActivityNode predecessor = edge.getSource();

                int lag = edge.getLag();

                int value = 0;

                switch (edge.getDependencyType()) {

                    case FS:
                        value = predecessor.getEarlyFinish() + lag;
                        break;

                    case SS:
                        value = predecessor.getEarlyStart() + lag;
                        break;

                    case FF:
                        value = predecessor.getEarlyFinish() + lag - node.getDuration();
                        break;

                    case SF:
                        value = predecessor.getEarlyStart() + lag - node.getDuration();
                        break;
                }

                if (value > earlyStart) {
                    earlyStart = value;
                }
            }

            node.setEarlyStart(earlyStart);
            node.setEarlyFinish(earlyStart + node.getDuration());
        }
    }
}