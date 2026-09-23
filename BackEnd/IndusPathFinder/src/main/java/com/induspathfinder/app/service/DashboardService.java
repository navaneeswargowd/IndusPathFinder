package com.induspathfinder.app.service;

import com.induspathfinder.app.dto.response.AdminDashboardResponse;
import com.induspathfinder.app.dto.response.ProjectManagerDashboardResponse;

public interface DashboardService {

    AdminDashboardResponse getAdminDashboard();

    ProjectManagerDashboardResponse
    getProjectManagerDashboard(Long userId);
}