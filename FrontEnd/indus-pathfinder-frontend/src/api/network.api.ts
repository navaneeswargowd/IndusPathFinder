import {
  axiosClient,
} from "./axiosClient";

import {
  API_ENDPOINTS,
} from "./apiEndpoints";

import type {
  NetworkDiagram,
  NetworkDiagramRequest,
} from "../types/network.types";

export async function generateNetworkDiagramApi(
  request: NetworkDiagramRequest
): Promise<NetworkDiagram> {

  const response =
    await axiosClient.post<NetworkDiagram>(
      API_ENDPOINTS.NETWORK.GENERATE,
      request
    );

  return response.data;
}