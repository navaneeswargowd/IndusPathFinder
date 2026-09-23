package com.induspathfinder.app.dto.request.dependency;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DependencyDeleteRequestDto {
	
	@NotNull(message = "Dependency Id is required")
    private Long dependencyId;

}
