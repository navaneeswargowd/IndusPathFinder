export const NotificationStatus = {
  READ: "READ",
  UNREAD: "UNREAD",
} as const;

export type NotificationStatus =
  (typeof NotificationStatus)[keyof typeof NotificationStatus];

export interface NotificationResponse {
  notificationId: number;

  userId: number;

  title: string;

  message: string;

  status: NotificationStatus;

  createdOn: string;

  readOn: string | null;
}

export interface NotificationSearchRequest {
  userId: number;

  title?: string;

  status?: NotificationStatus;

  page: number;

  size: number;

  sortBy: string;

  direction: "asc" | "desc";
}

export interface NotificationDetailsRequest {
  notificationId: number;
}

export interface NotificationReadRequest {
  notificationId: number;

  userId: number;
}

export interface NotificationDeleteRequest {
  notificationId: number;

  userId: number;
}

export interface PageResponse<T> {
  content: T[];

  totalElements: number;

  totalPages: number;

  size: number;

  number: number;

  numberOfElements: number;

  first: boolean;

  last: boolean;

  empty: boolean;
}

export interface ApiResponse<T> {
  success: boolean;

  status: string;

  message: string;

  data: T;

  timestamp: string;
}