package com.induspathfinder.app.dto.request.dependency;


import com.induspathfinder.app.enums.DependencyType;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DependencyUpdateRequestDto {
	 	@NotNull(message = "Dependency Id is required")
	    private Long dependencyId;

	    @NotNull(message = "Predecessor Activity Id is required")
	    private Long predecessorActivityId;

	    @NotNull(message = "Successor Activity Id is required")
	    private Long successorActivityId;

	    @NotNull(message = "Dependency Type is required")
	    private DependencyType dependencyType;

}
