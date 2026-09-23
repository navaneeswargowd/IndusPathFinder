package com.induspathfinder.app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.induspathfinder.app.dto.request.ChangePasswordRequest;
import com.induspathfinder.app.dto.request.ProfileRequest;
import com.induspathfinder.app.dto.response.ProfileResponse;
import com.induspathfinder.app.service.ProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfileController {

    private final ProfileService profileService;

    // ==========================================================
    // Get Logged In User Profile
    // ==========================================================

    @GetMapping("/view")
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER')")
    public ResponseEntity<ProfileResponse> getProfile() {

        ProfileResponse response =
                profileService.getProfile();

        return ResponseEntity.ok(response);
    }

    // ==========================================================
    // Update Logged In User Profile
    // ==========================================================

    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER')")
    public ResponseEntity<ProfileResponse> updateProfile(
            @RequestBody ProfileRequest request) {

        ProfileResponse response =
                profileService.updateProfile(request);

        return ResponseEntity.ok(response);
    }

    // ==========================================================
    // Change Password
    // ==========================================================

    @PutMapping("/change-password")
    @PreAuthorize("hasAnyRole('ADMIN','PROJECT_MANAGER')")
    public ResponseEntity<String> changePassword(
            @RequestBody ChangePasswordRequest request) {

        profileService.changePassword(request);

        return ResponseEntity.ok(
                "Password changed successfully.");
    }

}