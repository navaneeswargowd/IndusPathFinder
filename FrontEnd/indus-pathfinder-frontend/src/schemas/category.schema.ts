import {
  z,
} from "zod";

export const categorySchema =
  z.object({
    categoryName:
      z
        .string()
        .trim()
        .min(
          1,
          "Category name is required"
        )
        .min(
          3,
          "Category name must contain at least 3 characters"
        )
        .max(
          100,
          "Category name cannot exceed 100 characters"
        ),

    status:
      z.enum([
        "ACTIVE",
        "INACTIVE",
      ]),
  });

export type CategoryFormValues =
  z.infer<
    typeof categorySchema
  >;