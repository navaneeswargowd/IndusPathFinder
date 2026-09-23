import {
  axiosClient,
} from "./axiosClient";

import {
  API_ENDPOINTS,
} from "./apiEndpoints";

import type {
  FloatAnalysisResult,
  FloatRequest,
} from "../types/float.types";

export async function runFloatAnalysisApi(
  request: FloatRequest
): Promise<FloatAnalysisResult[]> {
  const response =
    await axiosClient.post<FloatAnalysisResult[]>(
      API_ENDPOINTS.FLOAT.RUN,
      request
    );

  return response.data;
}