import {
  axiosClient,
} from "./axiosClient";

import {
  API_ENDPOINTS,
} from "./apiEndpoints";

import type {
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  VerifyOtpRequest,
} from "../types/auth.types";

export async function loginApi(
  request: LoginRequest
): Promise<LoginResponse> {
  const response =
    await axiosClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      request
    );

  return response.data;
}

export async function forgotPasswordApi(
  request: ForgotPasswordRequest
): Promise<string> {
  const response =
    await axiosClient.post<string>(
      API_ENDPOINTS.AUTH
        .FORGOT_PASSWORD,
      request
    );

  return response.data;
}

export async function verifyOtpApi(
  request: VerifyOtpRequest
): Promise<string> {
  const response =
    await axiosClient.post<string>(
      API_ENDPOINTS.AUTH
        .VERIFY_OTP,
      request
    );

  return response.data;
}

export async function resetPasswordApi(
  request: ResetPasswordRequest
): Promise<string> {
  const response =
    await axiosClient.post<string>(
      API_ENDPOINTS.AUTH
        .RESET_PASSWORD,
      request
    );

  return response.data;
}