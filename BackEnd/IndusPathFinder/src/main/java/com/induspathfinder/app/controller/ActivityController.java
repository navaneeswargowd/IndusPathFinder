package com.induspathfinder.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
import com.induspathfinder.app.service.ActivityService;

@RestController
@RequestMapping("/api/v1/activities")
public class ActivityController {
	
	@Autowired
    private ActivityService activityService;
	
	 @PostMapping("/create")
	    public ResponseEntity<ActivityResponseDto> createActivity(
	            @RequestBody ActivityRequestDto request) {

	        ActivityResponseDto response =
	                activityService.createActivity(request);

	        return new ResponseEntity<>(response, HttpStatus.CREATED);
	    }
	 @PostMapping("/search")
	 public ResponseEntity<Page<ActivitySearchResponseDto>> searchActivities(
	         @RequestBody ActivitySearchRequestDto request) {

	     return ResponseEntity.ok(
	             activityService.searchActivities(request));
	 }
	 @PostMapping("/details")
	 public ResponseEntity<ActivityDetailsResponseDto> getActivityDetails(
	         @RequestBody ActivityDetailsRequestDto request) {

	     ActivityDetailsResponseDto response =
	             activityService.getActivityDetails(request);

	     return ResponseEntity.ok(response);
	 }
	 @PutMapping("/update")
	 public ResponseEntity<ActivityUpdateResponseDto> updateActivity(
	         @RequestBody ActivityUpdateRequestDto request) {

	     return ResponseEntity.ok(activityService.updateActivity(request));
	 }
	 @DeleteMapping("/delete")
	 public ResponseEntity<ActivityDeleteResponseDto> deleteActivity(
	         @RequestBody ActivityDeleteRequestDto request) {

	     return ResponseEntity.ok(activityService.deleteActivity(request));
	 }

}
