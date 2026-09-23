package com.induspathfinder.app.dto.response;

import lombok.Data;

@Data
public class NetworkNodeDTO {

    private Long activityId;

    private String activityCode;

    private String activityName;

    private Integer duration;

    private Boolean critical;

}