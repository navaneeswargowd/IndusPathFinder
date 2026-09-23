package com.induspathfinder.app.dto.response.project;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDeleteResponseDto {

    private Long projectId;

    private String message;

    private boolean success;

}