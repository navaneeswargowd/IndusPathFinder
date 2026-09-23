package com.induspathfinder.app.controller;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.induspathfinder.app.dto.request.project.ProjectDeleteRequestDto;
import com.induspathfinder.app.dto.request.project.ProjectDetailsRequestDto;
import com.induspathfinder.app.dto.request.project.ProjectRequestDto;
import com.induspathfinder.app.dto.request.project.ProjectSearchRequestDto;
import com.induspathfinder.app.dto.request.project.ProjectUpdateRequestDto;
import com.induspathfinder.app.dto.response.project.ProjectDeleteResponseDto;
import com.induspathfinder.app.dto.response.project.ProjectDetailsResponseDto;
import com.induspathfinder.app.dto.response.project.ProjectResponseDto;
import com.induspathfinder.app.dto.response.project.ProjectSearchResponseDto;
import com.induspathfinder.app.service.ProjectService;

@RestController
@RequestMapping("api/v1/projects")
public class ProjectController {
	
	@Autowired
    private ProjectService projectService;
	@PostMapping("/create")
    public ResponseEntity<ProjectResponseDto> createProject(
            @RequestBody ProjectRequestDto request) {

        ProjectResponseDto response = projectService.createProject(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
	
	@GetMapping
	public ResponseEntity<List<ProjectResponseDto>> getAllProjects() {

	        List<ProjectResponseDto> projects =
	                projectService.getAllProjects();

	        return ResponseEntity.ok(projects);
	    }
	@PostMapping("/search")
	public ResponseEntity<Page<ProjectSearchResponseDto>> searchProjects(
	        @RequestBody ProjectSearchRequestDto request) {

	    return ResponseEntity.ok(projectService.searchProjects(request));
	}
	@PostMapping("/details")
	public ResponseEntity<ProjectDetailsResponseDto> getProjectDetails(
	        @RequestBody ProjectDetailsRequestDto request) {

	    ProjectDetailsResponseDto response = projectService.getProjectDetails(request);

	    return ResponseEntity.ok(response);
	}
	@PutMapping("/update")
	public ResponseEntity<ProjectResponseDto> updateProject(
	        @RequestBody ProjectUpdateRequestDto request) {

	    ProjectResponseDto response = projectService.updateProject(request);

	    return ResponseEntity.ok(response);
	}
	@DeleteMapping("/delete")
	public ResponseEntity<ProjectDeleteResponseDto> deleteProject(
	        @RequestBody ProjectDeleteRequestDto request) {

	    ProjectDeleteResponseDto response =
	            projectService.deleteProject(request);

	    return ResponseEntity.ok(response);
	}

	}
	


