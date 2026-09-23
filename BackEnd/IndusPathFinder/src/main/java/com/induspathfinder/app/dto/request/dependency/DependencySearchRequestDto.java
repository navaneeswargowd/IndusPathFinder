package com.induspathfinder.app.dto.request.dependency;



import com.induspathfinder.app.enums.DependencyType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DependencySearchRequestDto {
	private Long projectId;

    private String predecessorActivityName;

    private String successorActivityName;

    private DependencyType dependencyType;

    @Builder.Default
    private Integer page = 0;

    @Builder.Default
    private Integer size = 10;

    @Builder.Default
    private String sortBy = "dependencyId";

    @Builder.Default
    private String direction = "asc";

}
