import {
  axiosClient,
} from "./axiosClient";

import {
  API_ENDPOINTS,
} from "./apiEndpoints";

import type {
  ProjectDeleteRequest,
  ProjectDeleteResponse,
  ProjectDetailsRequest,
  ProjectDetailsResponse,
  ProjectPageResponse,
  ProjectRequest,
  ProjectResponse,
  ProjectSearchRequest,
  ProjectUpdateRequest,
} from "../types/project.types";

/*
 * ==========================================================
 * CREATE PROJECT
 * POST /api/v1/projects/create
 * ==========================================================
 */
export async function createProjectApi(
  request: ProjectRequest
): Promise<ProjectResponse> {
  const response =
    await axiosClient.post<ProjectResponse>(
      API_ENDPOINTS.PROJECTS.CREATE,
      request
    );

  return response.data;
}

/*
 * ==========================================================
 * SEARCH PROJECTS
 * POST /api/v1/projects/search
 * ==========================================================
 */
export async function searchProjectsApi(
  request: ProjectSearchRequest
): Promise<ProjectPageResponse> {
  const response =
    await axiosClient.post<ProjectPageResponse>(
      API_ENDPOINTS.PROJECTS.SEARCH,
      request
    );

  return response.data;
}

/*
 * ==========================================================
 * PROJECT DETAILS
 * POST /api/v1/projects/details
 * ==========================================================
 */
export async function getProjectDetailsApi(
  request: ProjectDetailsRequest
): Promise<ProjectDetailsResponse> {
  const response =
    await axiosClient.post<ProjectDetailsResponse>(
      API_ENDPOINTS.PROJECTS.DETAILS,
      request
    );

  return response.data;
}

/*
 * ==========================================================
 * UPDATE PROJECT
 * PUT /api/v1/projects/update
 * ==========================================================
 */
export async function updateProjectApi(
  request: ProjectUpdateRequest
): Promise<ProjectResponse> {
  const response =
    await axiosClient.put<ProjectResponse>(
      API_ENDPOINTS.PROJECTS.UPDATE,
      request
    );

  return response.data;
}

/*
 * ==========================================================
 * DELETE PROJECT
 *
 * Backend expects request BODY with DELETE.
 * ==========================================================
 */
export async function deleteProjectApi(
  request: ProjectDeleteRequest
): Promise<ProjectDeleteResponse> {
  const response =
    await axiosClient.delete<ProjectDeleteResponse>(
      API_ENDPOINTS.PROJECTS.DELETE,
      {
        data: request,
      }
    );

  return response.data;
}