// import {
//   z,
// } from "zod";

// export const profileSchema =
//   z.object({
//     firstName:
//       z
//         .string()
//         .trim()
//         .min(
//           2,
//           "First name is required"
//         )
//         .max(
//           50,
//           "First name is too long"
//         ),

//     lastName:
//       z
//         .string()
//         .trim()
//         .min(
//           2,
//           "Last name is required"
//         )
//         .max(
//           50,
//           "Last name is too long"
//         ),

//     userName:
//       z
//         .string()
//         .trim()
//         .min(
//           3,
//           "Username must contain at least 3 characters"
//         )
//         .max(
//           50,
//           "Username is too long"
//         ),

//     email:
//       z
//         .string()
//         .trim()
//         .email(
//           "Enter a valid email address"
//         ),
//   });

// export type ProfileFormValues =
//   z.infer<
//     typeof profileSchema
//   >;

import {
  z,
} from "zod";

import {
  INDIAN_MOBILE_REGEX,
} from "../utils/validation.utils";



export const profileSchema =
  z.object({

    firstName:
      z
        .string()
        .min(
          1,
          "First Name is required"
        )
        .max(
          50,
          "First Name is invalid"
        )
        .regex(
          /^[A-Za-z]+(?: [A-Za-z]+)*$/,
          "First Name is invalid"
        ),

    lastName:
      z
        .string()
        .min(
          1,
          "Last Name is required"
        )
        .max(
          50,
          "Last Name is invalid"
        )
        .regex(
          /^[A-Za-z]+(?: [A-Za-z]+)*$/,
          "Last Name is invalid"
        ),

  //   mobile:
  //     z
  //       .string()
  //       .min(
  //         1,
  //         "Mobile Number is required"
  //       )
  //       .regex(
  //         /^[0-9]{10}$/,
  //         "Enter a valid 10-digit Mobile Number"
  //       ),
  // });

      mobile:
      z
        .string()
        .min(
          1,
          "Mobile Number is required"
        )
        .regex(
          INDIAN_MOBILE_REGEX,
          "Enter a valid 10-digit Mobile Number starting with 6, 7, 8 or 9"
        ),
  });


export type ProfileFormValues =
  z.infer<
    typeof profileSchema
  >;