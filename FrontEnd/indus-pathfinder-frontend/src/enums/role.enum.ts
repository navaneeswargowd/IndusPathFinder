export const UserRole = {
    ADMIN: "ADMIN",
    PROJECT_MANAGER: "PROJECT_MANAGER",
  } as const;
  
  export type UserRole =
    (typeof UserRole)[keyof typeof UserRole];