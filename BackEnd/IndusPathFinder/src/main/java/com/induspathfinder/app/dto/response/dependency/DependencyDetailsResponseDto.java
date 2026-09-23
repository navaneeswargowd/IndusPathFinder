package com.induspathfinder.app.dto.response.dependency;

import java.time.LocalDateTime;

import com.induspathfinder.app.enums.DependencyType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DependencyDetailsResponseDto {
	private Long dependencyId;

    private Long projectId;

    private Long predecessorActivityId;

    private String predecessorActivityName;

    private Long successorActivityId;

    private String successorActivityName;

    private DependencyType dependencyType;

    private Long createdBy;

    private LocalDateTime createdOn;
    
    private Long updatedBy;

    private LocalDateTime updatedOn;

}
