import {
  z,
} from "zod";

import {
  ProjectPriority,
  ProjectStatus,
} from "../enums/project.enums";

export const projectSchema =
  z
    .object({
      // projectName: z
      //   .string()
      //   .trim()
      //   .min(
      //     1,
      //     "Project name is required"
      //   )
      //   .min(
      //     3,
      //     "Project name must contain at least 3 characters"
      //   )
      //   .max(
      //     100,
      //     "Project name cannot exceed 100 characters"
      //   ),

                projectName: z
            .string()
            .min(
              1,
              "Project Name is required"
            )
            .refine(
              (value) =>
                value.length >= 3 &&
                value.length <= 100 &&
                !value.startsWith(" ") &&
                !value.includes("  ") &&
                /^[A-Za-z0-9 _/.,&()#':-]+$/.test(value),
              "Project Name is invalid"
            ),

      // description: z
      //   .string()
      //   .trim()
      //   .max(
      //     500,
      //     "Description cannot exceed 500 characters"
      //   ),

           description: z
  .string()
  .refine(
    (value) => {
      // Description is optional
      if (value === "") {
        return true;
      }

      return (
        value.length <= 500 &&
        !value.startsWith(" ") &&
        !value.includes("  ") &&
        /^[A-Za-z0-9 _/.,&()#':;"!?@%+\-\r\n]*$/.test(
          value
        )
      );
    },
    "Description is invalid"
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

      status: z.enum([
        ProjectStatus.ACTIVE,
        ProjectStatus.INACTIVE,
        ProjectStatus.COMPLETED,
      ]),

      priority: z.enum([
        ProjectPriority.LOW,
        ProjectPriority.MEDIUM,
        ProjectPriority.HIGH,
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
        message:
          "End date cannot be before start date",

        path: [
          "endDate",
        ],
      }
    );

export type ProjectFormValues =
  z.infer<
    typeof projectSchema
  >;