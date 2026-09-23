package com.induspathfinder.app.serviceimpl;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.induspathfinder.app.dto.response.AdminDashboardResponse;
import com.induspathfinder.app.dto.response.ProjectManagerDashboardResponse;
import com.induspathfinder.app.exception.BadRequestException;
import com.induspathfinder.app.repository.DashboardRepository;
import com.induspathfinder.app.service.DashboardService;

@Service
public class DashboardServiceImpl
        implements DashboardService {

    private static final Logger LOGGER =
            LogManager.getLogger(
                    DashboardServiceImpl.class);

    private final DashboardRepository dashboardRepository;

    public DashboardServiceImpl(
            DashboardRepository dashboardRepository) {

        this.dashboardRepository =
                dashboardRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {

        long totalOrganizations =
                dashboardRepository.countOrganizations();

        long totalProjects =
                dashboardRepository.countAllProjects();

        AdminDashboardResponse response =
                AdminDashboardResponse.builder()
                        .totalOrganizations(
                                totalOrganizations)
                        .totalProjects(totalProjects)
                        .build();

        LOGGER.info(
                "Admin dashboard fetched. "
                        + "totalOrganizations={}, "
                        + "totalProjects={}",
                totalOrganizations,
                totalProjects);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectManagerDashboardResponse
    getProjectManagerDashboard(Long userId) {

        validateUserId(userId);

        long totalProjects =
                dashboardRepository
                        .countProjectsByUserId(userId);

        long totalActivities =
                dashboardRepository
                        .countActivitiesByUserId(userId);

        long totalDependencies =
                dashboardRepository
                        .countDependenciesByUserId(userId);

        ProjectManagerDashboardResponse response =
                ProjectManagerDashboardResponse.builder()
                        .totalProjects(totalProjects)
                        .totalActivities(totalActivities)
                        .totalDependencies(
                                totalDependencies)
                        .build();

        LOGGER.info(
                "Project Manager dashboard fetched. "
                        + "userId={}, totalProjects={}, "
                        + "totalActivities={}, "
                        + "totalDependencies={}",
                userId,
                totalProjects,
                totalActivities,
                totalDependencies);

        return response;
    }

    private void validateUserId(Long userId) {

        if (userId == null || userId <= 0) {

            throw new BadRequestException(
                    "Valid User ID is required");
        }
    }
}