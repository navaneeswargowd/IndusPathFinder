import type {
  ActivityPriority,
  ActivityStatus,
} from "../enums/activity.enums";

export interface ActivityRequest {
  projectId: number;

  actName: string;

  description: string;

  duration: number;

  startDate: string;

  endDate: string;

  priority: ActivityPriority;

  status: ActivityStatus;
}

export interface ActivityResponse {
  actId: number;

  projectId: number;

  actCode: string;

  actName: string;

  description: string;

  duration: number;

  startDate: string;

  endDate: string;

  priority: ActivityPriority;

  status: ActivityStatus;
}

export interface ActivitySearchRequest {
  projectId: number;

  actCode?: string;

  actName?: string;

  priority?: ActivityPriority;

  status?: ActivityStatus;

  page: number;

  size: number;

  sortBy: string;

  direction: "asc" | "desc";
}

export interface ActivitySearchResponse
  extends ActivityResponse {}

export interface ActivityDetailsRequest {
  actId: number;
}

export interface ActivityDetailsResponse
  extends ActivityResponse {}

export interface ActivityUpdateRequest {
  actId: number;

  projectId: number;

  actName: string;

  description: string;

  duration: number;

  startDate: string;

  endDate: string;

  priority: ActivityPriority;

  status: ActivityStatus;
}

export interface ActivityUpdateResponse
  extends ActivityResponse {}

export interface ActivityDeleteRequest {
  actId: number;
}

export interface ActivityDeleteResponse {
  actId: number;

  message: string;

  success: boolean;
}

export interface ActivityPageResponse {
  content: ActivitySearchResponse[];

  totalElements: number;

  totalPages: number;

  size: number;

  number: number;

  numberOfElements: number;

  first: boolean;

  last: boolean;

  empty: boolean;
}