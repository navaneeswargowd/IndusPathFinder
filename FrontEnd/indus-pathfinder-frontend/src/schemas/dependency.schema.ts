import {
  z,
} from "zod";

import {
  DependencyType,
} from "../enums/dependency.enums";

export const dependencySchema =
  z
    .object({
      predecessorActivityId:
        z
          .number()
          .int()
          .positive(
            "Predecessor activity is required"
          ),

      successorActivityId:
        z
          .number()
          .int()
          .positive(
            "Successor activity is required"
          ),

      dependencyType:
        z.enum([
          DependencyType.FS,
          DependencyType.SS,
          DependencyType.FF,
          DependencyType.SF,
        ]),
    })
    .refine(
      (
        values
      ) =>
        values.predecessorActivityId !==
        values.successorActivityId,
      {
        path: [
          "successorActivityId",
        ],

        message:
          "An activity cannot depend on itself",
      }
    );

export type DependencyFormValues =
  z.infer<
    typeof dependencySchema
  >;