import type {
  UserRole,
} from "../enums/role.enum";

export interface LoginRequest {
  email: string;

  password: string;
}

export interface LoginResponse {
  token: string;

  tokenType: string;

  userId: number;

  orgId: number;

  firstName: string;

  lastName: string;

  // IMPORTANT:
  // Backend uses userName, not username.
  userName: string;

  email: string;

  role: UserRole;

  status: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;

  otp: string;
}

export interface ResetPasswordRequest {
  email: string;

  otp: string;

  newPassword: string;

  confirmPassword: string;
}