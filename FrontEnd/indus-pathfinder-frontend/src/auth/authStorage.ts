import type {
  LoginResponse,
} from "../types/auth.types";

const ACCESS_TOKEN_KEY =
  "indusPathFinderAccessToken";

const AUTH_USER_KEY =
  "indusPathFinderUser";

/*
 * ==========================================================
 * SAVE AUTH
 * ==========================================================
 */

export function setAuthStorage(
  user:
    LoginResponse
): void {
  localStorage.setItem(
    ACCESS_TOKEN_KEY,
    user.token
  );

  localStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify(
      user
    )
  );
}

/*
 * ==========================================================
 * ACCESS TOKEN
 * ==========================================================
 */

export function getAccessToken():
string | null {
  return localStorage.getItem(
    ACCESS_TOKEN_KEY
  );
}

/*
 * ==========================================================
 * STORED USER
 * ==========================================================
 */

export function getStoredUser():
LoginResponse | null {
  try {
    const value =
      localStorage.getItem(
        AUTH_USER_KEY
      );

    if (
      !value
    ) {
      return null;
    }

    const user =
      JSON.parse(
        value
      ) as LoginResponse;

    /*
     * Don't restore an invalid stored
     * session without a token.
     */
    if (
      !user.token
    ) {
      clearAuthStorage();

      return null;
    }

    return user;
  } catch {
    clearAuthStorage();

    return null;
  }
}

/*
 * ==========================================================
 * CLEAR AUTH
 * ==========================================================
 */

export function clearAuthStorage():
void {
  localStorage.removeItem(
    ACCESS_TOKEN_KEY
  );

  localStorage.removeItem(
    AUTH_USER_KEY
  );
}