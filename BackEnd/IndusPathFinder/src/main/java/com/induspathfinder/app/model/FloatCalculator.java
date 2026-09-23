package com.induspathfinder.app.model;

import java.util.List;

public class FloatCalculator {

    /**
     * Calculates
     * Free Float
     * Independent Float
     */
    public static void calculate(List<ActivityNode> activities) {

        for (ActivityNode node : activities) {

            //---------------------------------------
            // FREE FLOAT
            //---------------------------------------

            if (node.getOutgoingEdges().isEmpty()) {

                node.setFreeFloat(node.getTotalFloat());

            } else {

                int minimumES = Integer.MAX_VALUE;

                for (Edge edge : node.getOutgoingEdges()) {

                    ActivityNode successor = edge.getDestination();

                    minimumES = Math.min(
                            minimumES,
                            successor.getEarlyStart() - edge.getLag());
                }

                int ff = minimumES - node.getEarlyFinish();

                node.setFreeFloat(Math.max(ff, 0));
            }

            //---------------------------------------
            // INDEPENDENT FLOAT
            //---------------------------------------

            if (node.getIncomingEdges().isEmpty()
                    || node.getOutgoingEdges().isEmpty()) {

                node.setIndependentFloat(node.getFreeFloat());

            } else {

                int maxLF = 0;

                for (Edge edge : node.getIncomingEdges()) {

                    ActivityNode predecessor = edge.getSource();

                    maxLF = Math.max(
                            maxLF,
                            predecessor.getLateFinish() + edge.getLag());
                }

                int minES = Integer.MAX_VALUE;

                for (Edge edge : node.getOutgoingEdges()) {

                    ActivityNode successor = edge.getDestination();

                    minES = Math.min(
                            minES,
                            successor.getEarlyStart() - edge.getLag());
                }

                int independentFloat =
                        minES - maxLF - node.getDuration();

                node.setIndependentFloat(
                        Math.max(independentFloat, 0));
            }
        }
    }
}