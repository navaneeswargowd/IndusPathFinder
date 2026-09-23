package com.induspathfinder.app.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.induspathfinder.app.dto.request.project.ProjectDeleteRequestDto;
import com.induspathfinder.app.dto.request.project.ProjectDetailsRequestDto;
import com.induspathfinder.app.dto.request.project.ProjectRequestDto;
import com.induspathfinder.app.dto.request.project.ProjectSearchRequestDto;
import com.induspathfinder.app.dto.request.project.ProjectUpdateRequestDto;
import com.induspathfinder.app.dto.response.project.ProjectDeleteResponseDto;
import com.induspathfinder.app.dto.response.project.ProjectDetailsResponseDto;
import com.induspathfinder.app.dto.response.project.ProjectResponseDto;
import com.induspathfinder.app.dto.response.project.ProjectSearchResponseDto;


@Service
public interface ProjectService {
	ProjectResponseDto createProject(ProjectRequestDto request);
	List<ProjectResponseDto> getAllProjects();
	Page<ProjectSearchResponseDto> searchProjects(ProjectSearchRequestDto request);
	ProjectDetailsResponseDto getProjectDetails(ProjectDetailsRequestDto request);
	ProjectResponseDto updateProject(ProjectUpdateRequestDto request);
	ProjectDeleteResponseDto deleteProject(ProjectDeleteRequestDto request);
	
}
