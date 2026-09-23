import type {
  ProjectPriority,
  ProjectStatus,
} from "../enums/project.enums";

/*
 * ==========================================================
 * POST /api/v1/projects/create
 * ProjectRequestDto
 * ==========================================================
 */
export interface ProjectRequest {
  projectName: string;

  description: string;

  startDate: string;

  endDate: string;

  status: ProjectStatus;

  priority: ProjectPriority;
}

/*
 * ==========================================================
 * ProjectResponseDto
 * ==========================================================
 */
export interface ProjectResponse {
  projectId: number;

  projectCode: string;

  projectName: string;

  description: string;

  startDate: string;

  endDate: string;

  status: ProjectStatus;

  priority: ProjectPriority;
}

/*
 * ==========================================================
 * ProjectUpdateRequestDto
 * ==========================================================
 */
export interface ProjectUpdateRequest {
  projectId: number;

  projectName: string;

  description: string;

  startDate: string;

  endDate: string;

  status: ProjectStatus;

  priority: ProjectPriority;
}

/*
 * ==========================================================
 * ProjectDetailsRequestDto
 * ==========================================================
 */
export interface ProjectDetailsRequest {
  projectId: number;
}

/*
 * ==========================================================
 * ProjectDetailsResponseDto
 * ==========================================================
 */
export interface ProjectDetailsResponse {
  projectId: number;

  projectCode: string;

  projectName: string;

  description: string;

  startDate: string;

  endDate: string;

  status: ProjectStatus;

  priority: ProjectPriority;
}

/*
 * ==========================================================
 * ProjectDeleteRequestDto
 * ==========================================================
 */
export interface ProjectDeleteRequest {
  projectId: number;
}

/*
 * ==========================================================
 * ProjectDeleteResponseDto
 * ==========================================================
 */
export interface ProjectDeleteResponse {
  projectId: number;

  message: string;

  success: boolean;
}

/*
 * ==========================================================
 * ProjectSearchRequestDto
 * ==========================================================
 */
export interface ProjectSearchRequest {
  projectCode?: string;

  projectName?: string;

  status?: ProjectStatus;

  priority?: ProjectPriority;

  page: number;

  size: number;

  sortBy: string;

  direction: "asc" | "desc";
}

/*
 * ==========================================================
 * ProjectSearchResponseDto
 * ==========================================================
 */
export interface ProjectSearchResponse
  extends ProjectResponse {}

/*
 * Spring Data Page<ProjectSearchResponseDto>
 */
export interface ProjectPageResponse {
  content: ProjectSearchResponse[];

  totalElements: number;

  totalPages: number;

  size: number;

  number: number;

  numberOfElements: number;

  first: boolean;

  last: boolean;

  empty: boolean;
}