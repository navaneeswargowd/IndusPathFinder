export interface CPMRequest {
  projectId: number;
}

export interface CPMResult {
  activityId: number;

  activityCode: string;

  activityName: string;

  duration: number;

  earlyStart: number;

  earlyFinish: number;

  lateStart: number;

  lateFinish: number;

  critical: boolean;
}