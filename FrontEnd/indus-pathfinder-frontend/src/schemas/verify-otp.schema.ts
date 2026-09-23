import {
  z,
} from "zod";

export const verifyOtpSchema =
    


  z.object({

    email: z
      .string()
      .min(
        1,
        "Email is required"
      )
      .email(
        "Enter a valid email address"
      ),
    otp: z
      .string()
      .min(
        1,
        "OTP is required"
      )
      .length(
        6,
        "OTP must contain exactly 6 digits"
      )
      .regex(
        /^[0-9]{6}$/,
        "OTP can contain numbers only"
      ),
  });

export type VerifyOtpFormValues =
  z.infer<
    typeof verifyOtpSchema
  >;