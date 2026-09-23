package com.induspathfinder.app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.induspathfinder.app.constants.MessageConstants;
import com.induspathfinder.app.dto.response.AdminDashboardResponse;
import com.induspathfinder.app.dto.response.ApiResponse;
import com.induspathfinder.app.dto.response.ProjectManagerDashboardResponse;
import com.induspathfinder.app.service.DashboardService;

import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/api/v1/dashboard")
@Validated
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService) {

        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin")
    public ResponseEntity<
            ApiResponse<AdminDashboardResponse>>
    getAdminDashboard() {

        AdminDashboardResponse response =
                dashboardService.getAdminDashboard();

        return ResponseEntity.ok(
                ApiResponse.success(
                        MessageConstants
                                .ADMIN_DASHBOARD_FETCHED,
                        response));
    }

    @GetMapping("/project-manager/{userId}")
    public ResponseEntity<
            ApiResponse<
                    ProjectManagerDashboardResponse>>
    getProjectManagerDashboard(
            @PathVariable
            @Positive(
                message =
                    "User ID must be greater than zero")
            Long userId) {

        ProjectManagerDashboardResponse response =
                dashboardService
                        .getProjectManagerDashboard(userId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        MessageConstants
                                .PROJECT_MANAGER_DASHBOARD_FETCHED,
                        response));
    }
}