package com.induspathfinder.app.dto.response;

import lombok.Data;

@Data
public class NetworkEdgeDTO {

    private Long fromActivityId;

    private Long toActivityId;

    private String dependencyType;

    private Integer lag;

}