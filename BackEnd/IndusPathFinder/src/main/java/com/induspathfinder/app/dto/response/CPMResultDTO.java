package com.induspathfinder.app.dto.response;

import lombok.Data;

@Data
public class CPMResultDTO {

    private Long activityId;

    private String activityCode;

    private String activityName;

    private Integer duration;

    private Integer earlyStart;

    private Integer earlyFinish;

    private Integer lateStart;

    private Integer lateFinish;

//    private Integer totalFloat;

    private Boolean critical;
    
//    private Integer freeFloat;
//    
//    private Integer independentFloat;

}