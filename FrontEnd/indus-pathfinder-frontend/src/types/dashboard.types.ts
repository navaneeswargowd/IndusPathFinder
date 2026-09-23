/*
 * ==========================================================
 * EXACT BACKEND DTO MAPPING
 * ==========================================================
 *
 * AdminDashboardResponse.java
 */

export interface AdminDashboardResponse {
  totalOrganizations: number;

  totalProjects: number;
}

/*
 * ==========================================================
 * EXACT BACKEND DTO MAPPING
 * ==========================================================
 *
 * ProjectManagerDashboardResponse.java
 */

export interface ProjectManagerDashboardResponse {
  totalProjects: number;

  totalActivities: number;

  totalDependencies: number;
}