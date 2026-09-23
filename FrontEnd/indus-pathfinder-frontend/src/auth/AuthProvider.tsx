import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  AuthContext,
} from "./AuthContext";

import {
  clearAuthStorage,
  getStoredUser,
  setAuthStorage,
} from "./authStorage";

import type {
  LoginResponse,
} from "../types/auth.types";

interface AuthProviderProps {
  children:
    ReactNode;
}

export default function AuthProvider({
  children,
}: AuthProviderProps) {
  const [
    user,
    setUser,
  ] =
    useState<LoginResponse | null>(
      () =>
        getStoredUser()
    );

  /*
   * ==========================================================
   * LOGIN / SET COMPLETE USER
   * ==========================================================
   */

  const setAuthenticatedUser =
    useCallback(
      (
        authenticatedUser:
          LoginResponse
      ) => {
        setAuthStorage(
          authenticatedUser
        );

        setUser(
          authenticatedUser
        );
      },
      []
    );

  /*
   * ==========================================================
   * UPDATE CURRENT USER
   * ==========================================================
   *
   * Used after:
   *
   * Profile update
   * Name update
   * Username update
   * Email update
   *
   * Keeps:
   * token
   * role
   * userId
   * orgId
   */

  const updateAuthenticatedUser =
    useCallback(
      (
        updates:
          Partial<LoginResponse>
      ) => {
        setUser(
          currentUser => {
            if (
              !currentUser
            ) {
              return null;
            }

            const updatedUser:
              LoginResponse = {
                ...currentUser,
                ...updates,
              };

            /*
             * Update localStorage too.
             *
             * This makes the updated name survive
             * browser refresh.
             */
            setAuthStorage(
              updatedUser
            );

            return updatedUser;
          }
        );
      },
      []
    );

  /*
   * ==========================================================
   * LOGOUT
   * ==========================================================
   */

  const logout =
    useCallback(
      async () => {
        clearAuthStorage();

        setUser(
          null
        );
      },
      []
    );

  /*
   * ==========================================================
   * CONTEXT VALUE
   * ==========================================================
   */

  const value =
    useMemo(
      () => ({
        user,

        isAuthenticated:
          Boolean(
            user?.token
          ),

        role:
          user?.role ??
          null,

        setAuthenticatedUser,

        updateAuthenticatedUser,

        logout,
      }),
      [
        user,
        setAuthenticatedUser,
        updateAuthenticatedUser,
        logout,
      ]
    );

  return (
    <AuthContext.Provider
      value={
        value
      }
    >
      {children}
    </AuthContext.Provider>
  );
}