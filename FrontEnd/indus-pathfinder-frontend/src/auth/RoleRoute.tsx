import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  useAuth,
} from "./useAuth";

import {
  ROUTES,
} from "../config/routes.config";

import type {
  UserRole,
} from "../enums/role.enum";

interface RoleRouteProps {
  allowedRoles:
    UserRole[];
}

export default function RoleRoute({
  allowedRoles,
}: RoleRouteProps) {
  const {
    user,
    isAuthenticated,
  } = useAuth();

  if (
    !isAuthenticated ||
    !user
  ) {
    return (
      <Navigate
        to={
          ROUTES.LOGIN
        }
        replace
      />
    );
  }

  const hasAccess =
    allowedRoles.includes(
      user.role
    );

  if (
    !hasAccess
  ) {
    return (
      <Navigate
        to={
          ROUTES.UNAUTHORIZED
        }
        replace
      />
    );
  }

  return <Outlet />;
}