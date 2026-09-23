export const ROUTES = {
  ROOT: "/",

  LOGIN: "/login",

  REGISTER: "/register",

  FORGOT_PASSWORD:
    "/forgot-password",

  VERIFY_OTP:
    "/verify-otp",

  RESET_PASSWORD:
    "/reset-password",

  UNAUTHORIZED:
    "/unauthorized",

ADMIN: {
  DASHBOARD:
    "/admin/dashboard",

  CATEGORIES:
    "/admin/categories",

      ORGANIZATIONS:
      "/admin/organizations",

  AUDIT_LOGS:
    "/admin/audit-logs",

  NOTIFICATIONS:
    "/admin/notifications",

  PROFILE:
    "/admin/profile",

  CHANGE_PASSWORD:
    "/admin/change-password",
},
PROJECT_MANAGER: {
  DASHBOARD:
    "/pm/dashboard",

  PROJECTS:
    "/pm/projects",

  PROJECT_CREATE:
    "/pm/projects/create",

  PROJECT_DETAILS:
    "/pm/projects/:projectId",

  PROJECT_EDIT:
    "/pm/projects/:projectId/edit",

  NOTIFICATIONS:
    "/pm/notifications",

  PROFILE:
    "/pm/profile",

  CHANGE_PASSWORD:
    "/pm/change-password",
},
} as const;