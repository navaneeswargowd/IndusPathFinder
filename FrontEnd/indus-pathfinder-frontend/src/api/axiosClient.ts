import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import {
  clearAuthStorage,
  getAccessToken,
} from "../auth/authStorage";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8081";

export const axiosClient =
  axios.create({
    baseURL: API_BASE_URL,

    timeout: 30_000,

    headers: {
      "Content-Type":
        "application/json",

      Accept:
        "application/json",
    },
  });

axiosClient.interceptors.request.use(
  (
    config:
      InternalAxiosRequestConfig
  ) => {
    const token =
      getAccessToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (
    error:
      AxiosError
  ) =>
    Promise.reject(
      error
    )
);

axiosClient.interceptors.response.use(
  (
    response
  ) =>
    response,

  (
    error:
      AxiosError
  ) => {
    if (
      error.response?.status ===
      401
    ) {
      clearAuthStorage();

      const path =
        window.location.pathname;

      const publicRoutes = [
        "/login",
        "/register",
        "/forgot-password",
        "/verify-otp",
        "/reset-password",
      ];

      if (
        !publicRoutes.includes(
          path
        )
      ) {
        window.location.href =
          "/login?sessionExpired=true";
      }
    }

    return Promise.reject(
      error
    );
  }
);