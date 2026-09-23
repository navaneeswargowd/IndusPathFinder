package com.induspathfinder.app.dto.response.dependency;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DependencyDeleteResponseDto {

    private Long dependencyId;

    private String message;

    private boolean success;

}