import {
  axiosClient,
} from "./axiosClient";

import {
  API_ENDPOINTS,
} from "./apiEndpoints";

import type {
  ApiResponse,
} from "../types/common.types";

import type {
  AdminDashboardResponse,
  ProjectManagerDashboardResponse,
} from "../types/dashboard.types";

/*
 * ==========================================================
 * ADMIN DASHBOARD
 * ==========================================================
 */

export async function getAdminDashboardApi():
Promise<AdminDashboardResponse> {
  const response =
    await axiosClient.get<
      ApiResponse<AdminDashboardResponse>
    >(
      API_ENDPOINTS
        .DASHBOARD
        .ADMIN
    );

  return response.data.data;
}

/*
 * ==========================================================
 * PROJECT MANAGER DASHBOARD
 * ==========================================================
 */

export async function getProjectManagerDashboardApi(
  userId:
    number
): Promise<ProjectManagerDashboardResponse> {
  const response =
    await axiosClient.get<
      ApiResponse<ProjectManagerDashboardResponse>
    >(
      `${API_ENDPOINTS.DASHBOARD.PROJECT_MANAGER}/${userId}`
    );

  return response.data.data;
}