import {
  createContext,
} from "react";

import type {
  LoginResponse,
} from "../types/auth.types";

import type {
  UserRole,
} from "../enums/role.enum";

export interface AuthContextValue {
  user:
    LoginResponse | null;

  isAuthenticated:
    boolean;

  role:
    UserRole | null;

  setAuthenticatedUser: (
    user:
      LoginResponse
  ) => void;

  updateAuthenticatedUser: (
    updates:
      Partial<LoginResponse>
  ) => void;

  logout:
    () => Promise<void>;
}

export const AuthContext =
  createContext<
    AuthContextValue | undefined
  >(undefined);