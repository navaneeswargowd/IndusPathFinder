export const ActivityPriority = {
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
} as const;

export type ActivityPriority =
  (typeof ActivityPriority)[keyof typeof ActivityPriority];

export const ActivityStatus = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
} as const;

export type ActivityStatus =
  (typeof ActivityStatus)[keyof typeof ActivityStatus];