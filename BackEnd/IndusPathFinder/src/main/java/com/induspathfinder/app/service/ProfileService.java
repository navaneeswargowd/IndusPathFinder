package com.induspathfinder.app.service;

import com.induspathfinder.app.dto.request.ChangePasswordRequest;
import com.induspathfinder.app.dto.request.ProfileRequest;
import com.induspathfinder.app.dto.response.ProfileResponse;

public interface ProfileService {

	ProfileResponse getProfile();
	ProfileResponse updateProfile(ProfileRequest request);
	
	void changePassword(ChangePasswordRequest request);
}
