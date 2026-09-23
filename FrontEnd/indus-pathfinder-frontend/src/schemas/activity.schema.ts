import {
  z,
} from "zod";

import {
  ActivityPriority,
  ActivityStatus,
} from "../enums/activity.enums";

export const activitySchema =
  z
    .object({
      actName: z
        .string()
        .trim()
        .min(
          1,
          "Activity name is required"
        )
        .min(
          3,
          "Activity name must contain at least 3 characters"
        )
        .max(
          100,
          "Activity name cannot exceed 100 characters"
        ),

      description: z
        .string()
        .trim()
        .max(
          500,
          "Description cannot exceed 500 characters"
        ),

      duration: z
        .number()
        .min(
          1,
          "Duration must be greater than zero"
        ),

      startDate: z
        .string()
        .min(
          1,
          "Start date is required"
        ),

      endDate: z
        .string()
        .min(
          1,
          "End date is required"
        ),

      priority: z.enum([
        ActivityPriority.HIGH,
        ActivityPriority.MEDIUM,
        ActivityPriority.LOW,
      ]),

      status: z.enum([
        ActivityStatus.NOT_STARTED,
        ActivityStatus.IN_PROGRESS,
        ActivityStatus.COMPLETED,
      ]),
    })
    .refine(
      (data) => {
        if (
          !data.startDate ||
          !data.endDate
        ) {
          return true;
        }

        return (
          new Date(
            data.startDate
          ) <=
          new Date(
            data.endDate
          )
        );
      },
      {
        path: [
          "endDate",
        ],

        message:
          "End date cannot be before start date",
      }
    );

export type ActivityFormValues =
  z.infer<
    typeof activitySchema
  >;