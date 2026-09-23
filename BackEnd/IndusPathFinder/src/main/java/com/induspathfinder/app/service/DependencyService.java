package com.induspathfinder.app.service;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

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



@Service
public interface DependencyService {

	DependencyResponseDto createDependency(DependencyRequestDto request);
	Page<DependencySearchResponseDto> searchDependencies(DependencySearchRequestDto request);
	DependencyDetailsResponseDto getDependencyDetails(DependencyDetailsRequestDto request);
	DependencyUpdateResponseDto updateDependency(DependencyUpdateRequestDto request);
	DependencyDeleteResponseDto deleteDependency(DependencyDeleteRequestDto request);
}
