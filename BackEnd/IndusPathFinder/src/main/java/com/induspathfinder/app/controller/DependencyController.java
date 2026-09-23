package com.induspathfinder.app.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.induspathfinder.app.dto.request.dependency.DependencyDeleteRequestDto;
import com.induspathfinder.app.dto.request.dependency.DependencyDetailsRequestDto;
import com.induspathfinder.app.dto.request.dependency.DependencyRequestDto;
import com.induspathfinder.app.dto.request.dependency.DependencySearchRequestDto;
import com.induspathfinder.app.dto.request.dependency.DependencyUpdateRequestDto;
import com.induspathfinder.app.dto.response.dependency.DependencyDeleteResponseDto;
import com.induspathfinder.app.dto.response.dependency.DependencyDetailsResponseDto;
import com.induspathfinder.app.dto.response.dependency.DependencyResponseDto;
import com.induspathfinder.app.dto.response.dependency.DependencySearchResponseDto;
import com.induspathfinder.app.dto.response.dependency.DependencyUpdateResponseDto;
import com.induspathfinder.app.service.DependencyService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/dependencies")
public class DependencyController {

    private final DependencyService dependencyService;

    public DependencyController(DependencyService dependencyService) {
        this.dependencyService = dependencyService;
    }

    @PostMapping("/create")
    public ResponseEntity<DependencyResponseDto> createDependency(
            @Valid @RequestBody DependencyRequestDto request){

        return ResponseEntity.ok(dependencyService.createDependency(request));
    }
    @PostMapping("/search")
    public ResponseEntity<Page<DependencySearchResponseDto>> searchDependencies(
            @RequestBody DependencySearchRequestDto request){

        return ResponseEntity.ok(
                dependencyService.searchDependencies(request));
    }
    @PostMapping("/details")
    public ResponseEntity<DependencyDetailsResponseDto>
    getDependencyDetails(
            @Valid @RequestBody
            DependencyDetailsRequestDto request){

        return ResponseEntity.ok(
                dependencyService.getDependencyDetails(request));
    }
    @PutMapping("/update")
    public ResponseEntity<DependencyUpdateResponseDto> updateDependency(
            @Valid @RequestBody DependencyUpdateRequestDto request) {

        return ResponseEntity.ok(
                dependencyService.updateDependency(request));
    }
    @DeleteMapping("/delete")
    public ResponseEntity<DependencyDeleteResponseDto> deleteDependency(
            @Valid @RequestBody DependencyDeleteRequestDto request) {

        return ResponseEntity.ok(
                dependencyService.deleteDependency(request));
    }
    
}
