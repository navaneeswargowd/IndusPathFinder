package com.induspathfinder.app.dto.request.project;


import com.induspathfinder.app.enums.ProjectPriority;
import com.induspathfinder.app.enums.ProjectStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectSearchRequestDto {
	
	private String projectCode;

    private String projectName;

    private ProjectStatus status;
    
    private ProjectPriority priority;

    @Builder.Default
    private Integer page = 0;
    @Builder.Default
    private Integer size = 10;
    @Builder.Default
    private String sortBy = "projectId";
    @Builder.Default
    private String direction = "asc";

}
