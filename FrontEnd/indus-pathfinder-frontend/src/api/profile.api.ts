import {
  axiosClient,
} from "./axiosClient";

import {
  API_ENDPOINTS,
} from "./apiEndpoints";

import type {
  ChangePasswordRequest,
  ProfileRequest,
  ProfileResponse,
} from "../types/profile.types";

export async function getProfileApi():
Promise<ProfileResponse> {
  const response =
    await axiosClient.get<ProfileResponse>(
      API_ENDPOINTS.PROFILE.VIEW
    );

  return response.data;
}

export async function updateProfileApi(
  request:
    ProfileRequest
): Promise<ProfileResponse> {
  const response =
    await axiosClient.put<ProfileResponse>(
      API_ENDPOINTS.PROFILE.UPDATE,
      request
    );

  return response.data;
}

export async function changePasswordApi(
  request:
    ChangePasswordRequest
): Promise<string> {
  const response =
    await axiosClient.put<string>(
      API_ENDPOINTS
        .PROFILE
        .CHANGE_PASSWORD,
      request
    );

  return response.data;
}