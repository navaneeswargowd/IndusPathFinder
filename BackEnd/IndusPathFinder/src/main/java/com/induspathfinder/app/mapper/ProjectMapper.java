package com.induspathfinder.app.mapper;

import org.springframework.stereotype.Component;

import com.induspathfinder.app.dto.response.project.ProjectDetailsResponseDto;
import com.induspathfinder.app.dto.response.project.ProjectResponseDto;
import com.induspathfinder.app.dto.response.project.ProjectSearchResponseDto;
import com.induspathfinder.app.entity.Project;

@Component
public class ProjectMapper {

    public ProjectResponseDto mapToResponse(Project project) {

        return ProjectResponseDto.builder()
                .projectId(project.getProjectId())
                .projectCode(project.getProjectCode())
                .projectName(project.getProjectName())
                .description(project.getDescription())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .status(project.getStatus())
                .priority(project.getPriority())
                .build();
    }

    public ProjectSearchResponseDto mapToSearchResponse(Project project) {

        return ProjectSearchResponseDto.builder()
                .projectId(project.getProjectId())
                .projectCode(project.getProjectCode())
                .projectName(project.getProjectName())
                .description(project.getDescription())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .status(project.getStatus())
                .priority(project.getPriority())
                .build();
    }

    public ProjectDetailsResponseDto mapToDetailsResponse(Project project) {

        return ProjectDetailsResponseDto.builder()
                .projectId(project.getProjectId())
                .projectCode(project.getProjectCode())
                .projectName(project.getProjectName())
                .description(project.getDescription())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .status(project.getStatus())
                .priority(project.getPriority())
                .build();
    }
}