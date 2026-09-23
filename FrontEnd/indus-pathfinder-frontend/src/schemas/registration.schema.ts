
// ----------------------------------------------------------------------------------
import { z } from "zod";

import {
  //NAME_REGEX,
  //ORGANIZATION_NAME_REGEX,
  INDIAN_MOBILE_REGEX,
  INDIAN_PIN_REGEX,
  //CIN_REGEX,
   DISTRICT_REGEX,
  EMAIL_REGEX,
  PAN_REGEX,
  GST_REGEX,
  REGISTRATION_NUMBER_REGEX,
  USERNAME_REGEX,
  FIRST_NAME_REGEX,
  LAST_NAME_REGEX,
} from "../utils/validation.utils";

/*
 * ============================================================
 * REGISTRATION SCHEMA
 * ============================================================
 */

export const registrationSchema = z.object({
  /*
   * ==========================================================
   * ORGANIZATION DETAILS
   * ==========================================================
   */

 orgName: z
  .string()
  .min(3, "Organization name is required")
  .max(100, "Organization name is invalid")
  .refine(
    (value) => value.trim().length > 0,
    "Organization name is required"
  )
  .refine(
    (value) => !/\s{2,}/.test(value),
    "Organization name is invalid"
  )
  .refine(
    (value) => /^[A-Za-z0-9&.,'()\-\/ ]+$/.test(value),
    "Organization name is invalid"
  ),

  regNum: z
    .string()
    .trim()
    .min(1, "Registration number is required")
    .max(30, "Registration number must not exceed 30 characters")
    .regex(
      REGISTRATION_NUMBER_REGEX,
      "Registration number must start with a number and contain only letters and numbers"
    ),

    categoryId: z
  .number()
  .min(1, "Category is required"),


orgEmail: z
  .string()
  .min(
    1,
    "Organization email is required"
  )
  .regex(
    EMAIL_REGEX,
    "Organization email is invalid"
  ),




cin: z
  .string()
  .min(
    1,
    "CIN is required"
  )
  .superRefine((value, ctx) => {
    const cin = value.toUpperCase();

    /*
     * Position 1
     */
    if (
      cin.length >= 1 &&
      !/^[LU]$/.test(cin[0])
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "First character of CIN must be L or U",
      });

      return;
    }

    /*
     * Characters 2-6
     *
     * Show error as soon as the user
     * enters an invalid character.
     */
    if (
      cin.length >= 2 &&
      !/^[0-9]*$/.test(
        cin.slice(1, Math.min(cin.length, 6))
      )
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Characters 2-6 of CIN must be numbers",
      });

      return;
    }

    /*
     * Once position 6 is reached,
     * make sure all five are numbers.
     */
    if (
      cin.length >= 6 &&
      !/^[0-9]{5}$/.test(
        cin.slice(1, 6)
      )
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Characters 2-6 of CIN must be numbers",
      });

      return;
    }

    /*
     * Characters 7-8
     */
    if (
      cin.length >= 7 &&
      !/^[A-Z]*$/.test(
        cin.slice(6, Math.min(cin.length, 8))
      )
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Characters 7-8 of CIN must be letters",
      });

      return;
    }

    if (
      cin.length >= 8 &&
      !/^[A-Z]{2}$/.test(
        cin.slice(6, 8)
      )
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Characters 7-8 of CIN must be letters",
      });

      return;
    }

    /*
     * Characters 9-12
     */
    if (
      cin.length >= 9 &&
      !/^[0-9]*$/.test(
        cin.slice(8, Math.min(cin.length, 12))
      )
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Characters 9-12 of CIN must be numbers",
      });

      return;
    }

    if (
      cin.length >= 12 &&
      !/^[0-9]{4}$/.test(
        cin.slice(8, 12)
      )
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Characters 9-12 of CIN must be numbers",
      });

      return;
    }

    /*
     * Characters 13-15 = PLC
     */
    if (
      cin.length >= 13 &&
      !"PLC".startsWith(
        cin.slice(12, Math.min(cin.length, 15))
      )
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Characters 13-15 of CIN must be PLC",
      });

      return;
    }

    if (
      cin.length >= 15 &&
      cin.slice(12, 15) !== "PLC"
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Characters 13-15 of CIN must be PLC",
      });

      return;
    }

    /*
     * Characters 16-21
     */
    if (
      cin.length >= 16 &&
      !/^[0-9]*$/.test(
        cin.slice(15, Math.min(cin.length, 21))
      )
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Characters 16-21 of CIN must be numbers",
      });

      return;
    }

    /*
     * Complete CIN
     */
    if (
      cin.length === 21 &&
      !/^[LU][0-9]{5}[A-Z]{2}[0-9]{4}PLC[0-9]{6}$/.test(
        cin
      )
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "CIN is invalid",
      });
    }
  }),

 pan: z
  .string()
  .min(
    1,
    "PAN is required"
  )
  .superRefine((value, ctx) => {
    const pan =
      value.toUpperCase();

    // Characters 1-5 must be letters
    if (
      pan.length >= 1 &&
      pan.length <= 5 &&
      !/^[A-Z]+$/.test(pan)
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Characters 1-5 of PAN must be letters",
      });

      return;
    }

    // Characters 6-9 must be numbers
    if (
      pan.length >= 6 &&
      pan.length <= 9 &&
      !/^[A-Z]{5}[0-9]+$/.test(pan)
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Characters 6-9 of PAN must be numbers",
      });

      return;
    }

    // Character 10 must be a letter
    if (
      pan.length === 10 &&
      !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Character 10 of PAN must be a letter",
      });

      return;
    }

        // PAN must be exactly 10 characters
    if (pan.length > 0 && pan.length < 10) {
      ctx.addIssue({
        code: "custom",
        message: "PAN must contain exactly 10 characters",
      });
      return;
    }

    // Complete PAN
    if (
      pan.length === 10 &&
      !PAN_REGEX.test(pan)
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "PAN is invalid",
      });
    }
  }),

gst: z
  .string()
  .min(
    1,
    "GSTIN is required"
  )
  .superRefine((value, ctx) => {
    const gst =
      value.toUpperCase();

    // Characters 1-2: numbers
    if (
      gst.length >= 1 &&
      gst.length <= 2 &&
      !/^[0-9]+$/.test(gst)
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Characters 1-2 of GSTIN must be numbers",
      });

      return;
    }

    // Characters 3-7: letters
    if (
      gst.length >= 3 &&
      gst.length <= 7 &&
      !/^[0-9]{2}[A-Z]+$/.test(gst)
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Characters 3-7 of GSTIN must be letters",
      });

      return;
    }

    // Characters 8-11: numbers
    if (
      gst.length >= 8 &&
      gst.length <= 11 &&
      !/^[0-9]{2}[A-Z]{5}[0-9]+$/.test(gst)
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Characters 8-11 of GSTIN must be numbers",
      });

      return;
    }

    // Character 12: letter
    if (
      gst.length === 12 &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]$/.test(gst)
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Character 12 of GSTIN must be a letter",
      });

      return;
    }

    // Character 13: number or letter
    if (
      gst.length === 13 &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]$/.test(gst)
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Character 13 of GSTIN must be a number or letter",
      });

      return;
    }

    // Character 14: Z
    if (
      gst.length === 14 &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z$/.test(gst)
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Character 14 of GSTIN must be Z",
      });

      return;
    }

    // Character 15: number or letter
    if (
      gst.length === 15 &&
      !GST_REGEX.test(gst)
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Character 15 of GSTIN must be a number or letter",
      });
       return;
    }

    // GSTIN must be exactly 15 characters
    if (gst.length > 0 && gst.length < 15) {
      ctx.addIssue({
        code: "custom",
        message: "GSTIN must contain exactly 15 characters",
      });
    }
  }),

  

  

  /*
   * ==========================================================
   * CONTACT DETAILS
   * ==========================================================
   */



email: z
  .string()
  .min(
    1,
    "Project Manager Email is required"
  )
  .regex(
    EMAIL_REGEX,
    "Project Manager Email is invalid"
  ),
orgPhone: z
  .string()
  .trim()
  .min(
    1,
    "Organization phone number is required"
  )
  .regex(
    INDIAN_MOBILE_REGEX,
    "Organization phone number is invalid"
  ),

  /*
   * ==========================================================
   * ADDRESS
   * ==========================================================
   */


// address: z
//   .string()
//   .min(
//     1,
//     "Address is required"
//   )
//   .refine(
//     (value) =>
//       value.length >= 5 &&
//       value.length <= 30 &&
//       /^[A-Za-z0-9.,/#'()&-]+(?: [A-Za-z0-9.,/#'()&-]+)*$/.test(value),
//     "Address is invalid"
//   ),



address: z
  .string()
  .min(
    1,
    "Address is required"
  )
  .refine(
    (value) =>
      value.length >= 5 &&
      value.length <= 250 &&
      !value.startsWith(" ") &&
      !value.includes("  ") &&
      /^[A-Za-z0-9 ,./#()&:'"\-\r\n]+$/.test(value),
    "Address is invalid"
  ),

  country: z
    .string()
    .min(1, "Country is required"),

  state: z
    .string()
    .min(1, "State is required"),

  city: z
    .string()
    .min(1, "City is required"),

 dist: z
  .string()
  .min(
    1,
    "District is required"
  )
  .regex(
    DISTRICT_REGEX,
    "District is invalid"
  ),

  pin: z
    .string()
    .trim()
    .regex(
      INDIAN_PIN_REGEX,
      "Enter a valid 6-digit PIN code"
    ),

    logo: z
  .string(),

  /*
   * ==========================================================
   * CONTACT PERSON
   * ==========================================================
   */

firstName: z
  .string()
  .min(
    1,
    "First name is required"
  )
  .regex(
    FIRST_NAME_REGEX,
    "First name is invalid"
  ),

 lastName: z
  .string()
  .min(
    1,
    "Last name is required"
  )
  .regex(
    LAST_NAME_REGEX,
    "Last name is invalid"
  ),

userName: z
  .string()
  .min(1, "Username is required")
  .regex(
    USERNAME_REGEX,
    "Username is invalid"
  ),


contact: z
  .string()
  .trim()
  .min(
    1,
    "Contact Number is required"
  )
  .regex(
    INDIAN_MOBILE_REGEX,
    "Contact Number is invalid"
  ),


  
  /*
   * ==========================================================
   * WEBSITE
   * ==========================================================
   */

  website: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
})


/*
 * ============================================================
 * REGISTRATION FORM TYPE
 * ============================================================
 */

export type RegistrationFormValues =
  z.infer<typeof registrationSchema>;



  
  
