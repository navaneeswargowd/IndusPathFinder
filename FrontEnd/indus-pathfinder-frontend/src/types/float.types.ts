export interface FloatRequest {
  projectId: number;
}

export interface FloatAnalysisResult {
  activityId: number;

  activityCode: string;

  activityName: string;

  totalFloat: number;

  freeFloat: number;

  independentFloat: number;

  critical: boolean;
}