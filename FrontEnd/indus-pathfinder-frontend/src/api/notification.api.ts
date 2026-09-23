import {
  axiosClient,
} from "./axiosClient";

import {
  API_ENDPOINTS,
} from "./apiEndpoints";

import type {
  ApiResponse,
  NotificationDeleteRequest,
  NotificationDetailsRequest,
  NotificationReadRequest,
  NotificationResponse,
  NotificationSearchRequest,
  PageResponse,
} from "../types/notification.types";

/*
 * ==========================================================
 * SEARCH NOTIFICATIONS - ORIGINAL RESPONSE
 * ==========================================================
 *
 * Use this in NotificationsPage.tsx
 *
 * Returns:
 * ApiResponse<PageResponse<NotificationResponse>>
 */

export async function searchNotificationsApi(
  request:
    NotificationSearchRequest
): Promise<
  ApiResponse<
    PageResponse<NotificationResponse>
  >
> {
  const response =
    await axiosClient.post<
      ApiResponse<
        PageResponse<NotificationResponse>
      >
    >(
      API_ENDPOINTS
        .NOTIFICATIONS
        .SEARCH,
      request
    );

  return response.data;
}

/*
 * ==========================================================
 * SEARCH NOTIFICATION PAGE - UNWRAPPED
 * ==========================================================
 *
 * Use this ONLY for NotificationBell.tsx
 *
 * Returns:
 * PageResponse<NotificationResponse>
 */

export async function searchNotificationPageApi(
  request:
    NotificationSearchRequest
): Promise<
  PageResponse<NotificationResponse>
> {
  const response =
    await axiosClient.post<
      ApiResponse<
        PageResponse<NotificationResponse>
      >
    >(
      API_ENDPOINTS
        .NOTIFICATIONS
        .SEARCH,
      request
    );

  return response.data.data;
}

/*
 * ==========================================================
 * DETAILS
 * ==========================================================
 */

export async function getNotificationDetailsApi(
  request:
    NotificationDetailsRequest
): Promise<
  ApiResponse<NotificationResponse>
> {
  const response =
    await axiosClient.post<
      ApiResponse<NotificationResponse>
    >(
      API_ENDPOINTS
        .NOTIFICATIONS
        .DETAILS,
      request
    );

  return response.data;
}

/*
 * ==========================================================
 * MARK ONE AS READ
 * ==========================================================
 */

export async function markNotificationAsReadApi(
  request:
    NotificationReadRequest
): Promise<
  ApiResponse<unknown>
> {
  const response =
    await axiosClient.put<
      ApiResponse<unknown>
    >(
      API_ENDPOINTS
        .NOTIFICATIONS
        .READ,
      request
    );

  return response.data;
}

/*
 * ==========================================================
 * MARK ALL AS READ
 * ==========================================================
 */

export async function markAllNotificationsAsReadApi(
  userId: number
): Promise<
  ApiResponse<unknown>
> {
  const response =
    await axiosClient.put<
      ApiResponse<unknown>
    >(
      `${API_ENDPOINTS.NOTIFICATIONS.READ_ALL}/${userId}`
    );

  return response.data;
}

/*
 * ==========================================================
 * DELETE
 * ==========================================================
 */

export async function deleteNotificationApi(
  request:
    NotificationDeleteRequest
): Promise<
  ApiResponse<unknown>
> {
  const response =
    await axiosClient.delete<
      ApiResponse<unknown>
    >(
      API_ENDPOINTS
        .NOTIFICATIONS
        .DELETE,
      {
        data:
          request,
      }
    );

  return response.data;
}

/*
 * ==========================================================
 * COMPATIBILITY EXPORTS
 * ==========================================================
 */

export const markNotificationReadApi =
  markNotificationAsReadApi;

export const markAllNotificationsReadApi =
  markAllNotificationsAsReadApi;

export const markAsReadApi =
  markNotificationAsReadApi;

export const markAllAsReadApi =
  markAllNotificationsAsReadApi;