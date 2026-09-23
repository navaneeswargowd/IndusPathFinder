import {
  axiosClient,
} from "./axiosClient";

import {
  API_ENDPOINTS,
} from "./apiEndpoints";

import type {
  ActivityDeleteRequest,
  ActivityDeleteResponse,
  ActivityDetailsRequest,
  ActivityDetailsResponse,
  ActivityPageResponse,
  ActivityRequest,
  ActivityResponse,
  ActivitySearchRequest,
  ActivityUpdateRequest,
  ActivityUpdateResponse,
} from "../types/activity.types";

export async function createActivityApi(
  request: ActivityRequest
): Promise<ActivityResponse> {
  const response =
    await axiosClient.post<ActivityResponse>(
      API_ENDPOINTS.ACTIVITIES.CREATE,
      request
    );

  return response.data;
}

export async function searchActivitiesApi(
  request: ActivitySearchRequest
): Promise<ActivityPageResponse> {
  const response =
    await axiosClient.post<ActivityPageResponse>(
      API_ENDPOINTS.ACTIVITIES.SEARCH,
      request
    );

  return response.data;
}

export async function getActivityDetailsApi(
  request: ActivityDetailsRequest
): Promise<ActivityDetailsResponse> {
  const response =
    await axiosClient.post<ActivityDetailsResponse>(
      API_ENDPOINTS.ACTIVITIES.DETAILS,
      request
    );

  return response.data;
}

export async function updateActivityApi(
  request: ActivityUpdateRequest
): Promise<ActivityUpdateResponse> {
  const response =
    await axiosClient.put<ActivityUpdateResponse>(
      API_ENDPOINTS.ACTIVITIES.UPDATE,
      request
    );

  return response.data;
}

export async function deleteActivityApi(
  request: ActivityDeleteRequest
): Promise<ActivityDeleteResponse> {
  const response =
    await axiosClient.delete<ActivityDeleteResponse>(
      API_ENDPOINTS.ACTIVITIES.DELETE,
      {
        data: request,
      }
    );

  return response.data;
}