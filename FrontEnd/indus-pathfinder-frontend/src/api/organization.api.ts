import {
  axiosClient,
} from "./axiosClient";

import {
  API_ENDPOINTS,
} from "./apiEndpoints";

import type {
  OrganizationRequest,
   OrganizationPageResponse,
  OrganizationResponse,
  OrganizationSearchRequest,
} from "../types/organization.types";

export async function createOrganizationApi(
  request: OrganizationRequest
): Promise<OrganizationResponse> {
  const response =
    await axiosClient.post<OrganizationResponse>(
      API_ENDPOINTS.ORGANIZATIONS.CREATE,
      request
    );

  return response.data;
}

export async function searchOrganizationsApi(
  request:
    OrganizationSearchRequest
): Promise<
  OrganizationPageResponse
> {
  const response =
    await axiosClient.get<
      OrganizationPageResponse
    >(
      API_ENDPOINTS
        .ORGANIZATIONS
        .BASE,
      {
        params: {
          search:
            request.search ||
            undefined,

          status:
            request.status ||
            undefined,

          page:
            request.page,

          size:
            request.size,

          sortBy:
            request.sortBy,

          sortDir:
            request.sortDir,
        },
      }
    );

  return response.data;
}

export async function getOrganizationByIdApi(
  orgId:
    number
): Promise<
  OrganizationResponse
> {
  const response =
    await axiosClient.get<
      OrganizationResponse
    >(
      `${API_ENDPOINTS.ORGANIZATIONS.BASE}/${orgId}`
    );

  return response.data;
}