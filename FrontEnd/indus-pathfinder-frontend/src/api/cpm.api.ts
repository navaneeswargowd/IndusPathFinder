import {
  axiosClient,
} from "./axiosClient";

import {
  API_ENDPOINTS,
} from "./apiEndpoints";

import type {
  CPMRequest,
  CPMResult,
} from "../types/cpm.types";

export async function runCPMApi(
  request: CPMRequest
): Promise<CPMResult[]> {
  const response =
    await axiosClient.post<CPMResult[]>(
      API_ENDPOINTS.CPM.RUN,
      request
    );

  return response.data;
}