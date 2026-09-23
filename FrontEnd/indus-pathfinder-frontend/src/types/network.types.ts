export interface NetworkDiagramRequest {
  projectId: number;
}

export interface NetworkNode {
  activityId: number;

  activityCode: string;

  activityName: string;

  duration: number;

  critical: boolean;
}

export interface NetworkEdge {
  fromActivityId: number;

  toActivityId: number;

  dependencyType: string;

  lag: number;
}

export interface NetworkDiagram {
  nodes: NetworkNode[];

  edges: NetworkEdge[];
}