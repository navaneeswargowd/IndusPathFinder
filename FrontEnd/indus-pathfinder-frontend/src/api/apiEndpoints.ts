// src/api/apiEndpoints.ts

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN:
      "/api/v1/auth/login",

    FORGOT_PASSWORD:
      "/api/v1/auth/forgot-password",

    VERIFY_OTP:
      "/api/v1/auth/verify-otp",

    RESET_PASSWORD:
      "/api/v1/auth/reset-password",
  },

  ORGANIZATIONS: {
    CREATE:
      "/api/v1/organizations/create",

    BASE:
      "/api/v1/organizations",
  },

  CATEGORIES: {
    BASE:
      "/api/v1/admin/categories",

    SEARCH:
      "/api/v1/admin/categories/search",

    ACTIVE:
      "/api/v1/admin/categories/active",
  },

  NOTIFICATIONS: {
    BASE:
      "/api/v1/notifications",

    SEARCH:
      "/api/v1/notifications/search",

    DETAILS:
      "/api/v1/notifications/details",

    READ:
      "/api/v1/notifications/read",

    READ_ALL:
      "/api/v1/notifications/read-all",

    DELETE:
      "/api/v1/notifications/delete",
  },

  PROFILE: {
    VIEW:
      "/api/v1/profile/view",

    UPDATE:
      "/api/v1/profile/update",

    CHANGE_PASSWORD:
      "/api/v1/profile/change-password",
  },

  DASHBOARD: {
    ADMIN:
      "/api/v1/dashboard/admin",

    PROJECT_MANAGER:
      "/api/v1/dashboard/project-manager",
  },

  ANALYSIS: {
    CPM:
      "/api/v1/analysis/cpm",

    FLOAT:
      "/api/v1/analysis/float",

    NETWORK:
      "/api/v1/analysis/network",
  },

  AUDIT_LOGS: {
    BASE:
      "/api/v1/audit-logs",
  },

  PROJECTS: {
  BASE:
    "/api/v1/projects",

  CREATE:
    "/api/v1/projects/create",

  SEARCH:
    "/api/v1/projects/search",

  DETAILS:
    "/api/v1/projects/details",

  UPDATE:
    "/api/v1/projects/update",

  DELETE:
    "/api/v1/projects/delete",
},

PROJECT_MANAGER: {
  DASHBOARD:
    "/pm/dashboard",

  PROJECTS:
    "/pm/projects",

  PROJECT_CREATE:
    "/pm/projects/create",

  PROJECT_EDIT:
    "/pm/projects/:projectId/edit",

  NOTIFICATIONS:
    "/pm/notifications",

  PROFILE:
    "/pm/profile",

  CHANGE_PASSWORD:
    "/pm/change-password",
},

ACTIVITIES: {
  CREATE:
    "/api/v1/activities/create",

  SEARCH:
    "/api/v1/activities/search",

  DETAILS:
    "/api/v1/activities/details",

  UPDATE:
    "/api/v1/activities/update",

  DELETE:
    "/api/v1/activities/delete",
},

DEPENDENCIES: {
  CREATE:
    "/api/v1/dependencies/create",

  SEARCH:
    "/api/v1/dependencies/search",

  DETAILS:
    "/api/v1/dependencies/details",

  UPDATE:
    "/api/v1/dependencies/update",

  DELETE:
    "/api/v1/dependencies/delete",
},

CPM: {
  RUN:
    "/api/v1/cpm/run",
},
FLOAT: {
  RUN:
    "/api/v1/float/run",
},

NETWORK: {
  GENERATE:
    "/api/v1/network/generate",
},

REPORTS: {
  GENERATE:
    "/api/v1/reports/generate",
},

} as const;