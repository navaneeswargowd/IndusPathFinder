package com.induspathfinder.app.dto.request.dependency;


import com.induspathfinder.app.enums.DependencyType;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DependencyRequestDto {

    @NotNull(message = "Project Id is required")
    private Long projectId;

    @NotNull(message = "Predecessor Activity Id is required")
    private Long predecessorActivityId;

    @NotNull(message = "Successor Activity Id is required")
    private Long successorActivityId;

    @NotNull(message = "Dependency Type is required")
    private DependencyType dependencyType;
}