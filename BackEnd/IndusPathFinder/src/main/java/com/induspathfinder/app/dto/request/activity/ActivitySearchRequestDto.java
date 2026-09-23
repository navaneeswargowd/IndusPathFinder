package com.induspathfinder.app.dto.request.activity;


import com.induspathfinder.app.enums.ActivityPriority;
import com.induspathfinder.app.enums.ActivityStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivitySearchRequestDto {
	private Long projectId;

    private String actCode;

    private String actName;

    private ActivityPriority priority;

    private ActivityStatus status;
    @Builder.Default
    private Integer page = 0;
    @Builder.Default
    private Integer size = 10;
    @Builder.Default
    private String sortBy = "actId";
    @Builder.Default
    private String direction = "asc";

}
