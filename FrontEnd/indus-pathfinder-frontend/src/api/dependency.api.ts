import {
  axiosClient,
} from "./axiosClient";

import {
  API_ENDPOINTS,
} from "./apiEndpoints";

import type {
  DependencyCreateRequest,
  DependencyDeleteRequest,
  DependencyDeleteResponse,
  DependencyDetailsRequest,
  DependencyDetailsResponse,
  DependencyPageResponse,
  DependencyResponse,
  DependencySearchRequest,
  DependencyUpdateRequest,
  DependencyUpdateResponse,
} from "../types/dependency.types";

export async function createDependencyApi(
  request:
    DependencyCreateRequest
): Promise<DependencyResponse> {
  const response =
    await axiosClient.post<DependencyResponse>(
      API_ENDPOINTS.DEPENDENCIES.CREATE,
      request
    );

  return response.data;
}

export async function searchDependenciesApi(
  request:
    DependencySearchRequest
): Promise<DependencyPageResponse> {
  const response =
    await axiosClient.post<DependencyPageResponse>(
      API_ENDPOINTS.DEPENDENCIES.SEARCH,
      request
    );

  return response.data;
}

export async function getDependencyDetailsApi(
  request:
    DependencyDetailsRequest
): Promise<DependencyDetailsResponse> {
  const response =
    await axiosClient.post<DependencyDetailsResponse>(
      API_ENDPOINTS.DEPENDENCIES.DETAILS,
      request
    );

  return response.data;
}

export async function updateDependencyApi(
  request:
    DependencyUpdateRequest
): Promise<DependencyUpdateResponse> {
  const response =
    await axiosClient.put<DependencyUpdateResponse>(
      API_ENDPOINTS.DEPENDENCIES.UPDATE,
      request
    );

  return response.data;
}

export async function deleteDependencyApi(
  request:
    DependencyDeleteRequest
): Promise<DependencyDeleteResponse> {
  const response =
    await axiosClient.delete<DependencyDeleteResponse>(
      API_ENDPOINTS.DEPENDENCIES.DELETE,
      {
        data:
          request,
      }
    );

  return response.data;
}