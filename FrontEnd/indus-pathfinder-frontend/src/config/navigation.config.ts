import {
   ApartmentOutlined,
  AssessmentOutlined,
  DashboardOutlined,
  FolderOpenOutlined,
  NotificationsNoneOutlined,
  PersonOutlined,
  CategoryOutlined
} from "@mui/icons-material";

import type {
  SvgIconComponent,
} from "@mui/icons-material";

import {
  UserRole,
} from "../enums/role.enum";

import {
  ROUTES,
} from "./routes.config";



export interface NavigationItem {
  label: string;

  path: string;

  icon:
    SvgIconComponent;

  roles:
    UserRole[];
}

export const navigationItems:
  NavigationItem[] = [
    /*
     * ADMIN
     */

    {
      label:
        "Dashboard",

      path:
        ROUTES.ADMIN
          .DASHBOARD,

      icon:
        DashboardOutlined,

      roles: [
        UserRole.ADMIN,
      ],
    },

    {
  label:
    "Organizations",

  path:
    ROUTES.ADMIN
      .ORGANIZATIONS,

  icon:
    ApartmentOutlined,

  roles: [
    UserRole.ADMIN,
  ],
},

    {
  label:
    "Categories",

  path:
    ROUTES.ADMIN
      .CATEGORIES,

  icon:
    CategoryOutlined,

  roles: [
    UserRole.ADMIN,
  ],
},

    {
      label:
        "Audit Logs",

      path:
        ROUTES.ADMIN
          .AUDIT_LOGS,

      icon:
        AssessmentOutlined,

      roles: [
        UserRole.ADMIN,
      ],
    },

    {
      label:
        "Notifications",

      path:
        ROUTES.ADMIN
          .NOTIFICATIONS,

      icon:
        NotificationsNoneOutlined,

      roles: [
        UserRole.ADMIN,
      ],
    },

    {
      label:
        "Profile",

      path:
        ROUTES.ADMIN
          .PROFILE,

      icon:
        PersonOutlined,

      roles: [
        UserRole.ADMIN,
      ],
    },

    /*
     * PROJECT MANAGER
     */

    {
      label:
        "Dashboard",

      path:
        ROUTES
          .PROJECT_MANAGER
          .DASHBOARD,

      icon:
        DashboardOutlined,

      roles: [
        UserRole
          .PROJECT_MANAGER,
      ],
    },

    {
      label:
        "Projects",

      path:
        ROUTES
          .PROJECT_MANAGER
          .PROJECTS,

      icon:
        FolderOpenOutlined,

      roles: [
        UserRole
          .PROJECT_MANAGER,
      ],
    },

    {
      label:
        "Notifications",

      path:
        ROUTES
          .PROJECT_MANAGER
          .NOTIFICATIONS,

      icon:
        NotificationsNoneOutlined,

      roles: [
        UserRole
          .PROJECT_MANAGER,
      ],
    },

    {
      label:
        "Profile",

      path:
        ROUTES
          .PROJECT_MANAGER
          .PROFILE,

      icon:
        PersonOutlined,

      roles: [
        UserRole
          .PROJECT_MANAGER,
      ],
    },
  ];