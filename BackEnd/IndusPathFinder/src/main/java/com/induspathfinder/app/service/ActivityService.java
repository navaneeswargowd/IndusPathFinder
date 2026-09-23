package com.induspathfinder.app.service;

import org.springframework.stereotype.Service;

import com.induspathfinder.app.dto.request.activity.ActivityDeleteRequestDto;
import com.induspathfinder.app.dto.request.activity.ActivityDetailsRequestDto;
import com.induspathfinder.app.dto.request.activity.ActivityRequestDto;
import com.induspathfinder.app.dto.request.activity.ActivitySearchRequestDto;
import com.induspathfinder.app.dto.request.activity.ActivityUpdateRequestDto;
import com.induspathfinder.app.dto.response.activity.ActivityDeleteResponseDto;
import com.induspathfinder.app.dto.response.activity.ActivityDetailsResponseDto;
import com.induspathfinder.app.dto.response.activity.ActivityResponseDto;
import com.induspathfinder.app.dto.response.activity.ActivitySearchResponseDto;
import com.induspathfinder.app.dto.response.activity.ActivityUpdateResponseDto;

import org.springframework.data.domain.Page;

@Service
public interface ActivityService {
	ActivityResponseDto createActivity(ActivityRequestDto request);
	Page<ActivitySearchResponseDto> searchActivities(ActivitySearchRequestDto request);
	ActivityDetailsResponseDto getActivityDetails(ActivityDetailsRequestDto request);
	ActivityUpdateResponseDto updateActivity(ActivityUpdateRequestDto request);
	ActivityDeleteResponseDto deleteActivity(ActivityDeleteRequestDto request);
}
