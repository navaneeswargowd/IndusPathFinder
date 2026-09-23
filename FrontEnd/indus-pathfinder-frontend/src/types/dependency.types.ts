import type {
  DependencyType,
} from "../enums/dependency.enums";

export interface DependencyCreateRequest {
  projectId: number;

  predecessorActivityId: number;

  successorActivityId: number;

  dependencyType: DependencyType;
}

export interface DependencyResponse {
  dependencyId: number;

  projectId: number;

  predecessorActivityId: number;

  predecessorActivityName: string;

  successorActivityId: number;

  successorActivityName: string;

  dependencyType: DependencyType;
}

export interface DependencySearchRequest {
  projectId: number;

  predecessorActivityName?: string;

  successorActivityName?: string;

  dependencyType?: DependencyType;

  page: number;

  size: number;

  sortBy: string;

  direction:
    "asc" | "desc";
}

export interface DependencySearchResponse {
  dependencyId: number;

  projectId: number;

  predecessorActivityName: string;

  successorActivityName: string;

  dependencyType: DependencyType;
}

export interface DependencyDetailsRequest {
  dependencyId: number;
}

export interface DependencyDetailsResponse {
  dependencyId: number;

  projectId: number;

  predecessorActivityId: number;

  predecessorActivityName: string;

  successorActivityId: number;

  successorActivityName: string;

  dependencyType: DependencyType;

  createdBy: number | null;

  createdOn: string | null;

  updatedBy: number | null;

  updatedOn: string | null;
}

export interface DependencyUpdateRequest {
  dependencyId: number;

  predecessorActivityId: number;

  successorActivityId: number;

  dependencyType: DependencyType;
}

export interface DependencyUpdateResponse {
  dependencyId: number;

  projectId: number;

  predecessorActivityId: number;

  predecessorActivityName: string;

  successorActivityId: number;

  successorActivityName: string;

  dependencyType: DependencyType;
}

export interface DependencyDeleteRequest {
  dependencyId: number;
}

export interface DependencyDeleteResponse {
  dependencyId: number;

  message: string;

  success: boolean;
}

export interface DependencyPageResponse {
  content:
    DependencySearchResponse[];

  totalElements: number;

  totalPages: number;

  size: number;

  number: number;

  numberOfElements: number;

  first: boolean;

  last: boolean;

  empty: boolean;
}