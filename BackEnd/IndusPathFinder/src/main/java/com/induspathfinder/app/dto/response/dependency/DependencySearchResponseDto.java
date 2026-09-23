package com.induspathfinder.app.dto.response.dependency;



import com.induspathfinder.app.enums.DependencyType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DependencySearchResponseDto {
	private Long dependencyId;

    private Long projectId;

    private String predecessorActivityName;

    private String successorActivityName;

    private DependencyType dependencyType;

}
