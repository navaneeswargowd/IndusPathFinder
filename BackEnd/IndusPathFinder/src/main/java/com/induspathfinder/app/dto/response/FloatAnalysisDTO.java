package com.induspathfinder.app.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FloatAnalysisDTO {

    /**
     * Activity Details
     */
    private Long activityId;

    private String activityCode;

    private String activityName;

    /**
     * Duration
     */
//    private Integer duration;

    /**
     * Forward Pass
     */
//    private Integer earlyStart;
//
//    private Integer earlyFinish;

    /**
     * Backward Pass
     */
//    private Integer lateStart;
//
//    private Integer lateFinish;

    /**
     * Float Values
     */
    private Integer totalFloat;

    private Integer freeFloat;

    private Integer independentFloat;

    /**
     * Critical Path
     */
    private Boolean critical;

}