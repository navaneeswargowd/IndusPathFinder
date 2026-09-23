package com.induspathfinder.app.model;

//import com.induspathfinder.app.entity.DependencyType;
import com.induspathfinder.app.enums.DependencyType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Edge {

    /**
     * Source Activity
     */
    private ActivityNode predecessor;

    /**
     * Destination Activity
     */
    private ActivityNode successor;

    /**
     * Dependency Type
     * FS
     * SS
     * FF
     * SF
     */
    private DependencyType dependencyType;

    /**
     * Lag / Lead
     */
    @Builder.Default
    private int lag = 0;
    
    private ActivityNode destination;
    
    private ActivityNode source;


}