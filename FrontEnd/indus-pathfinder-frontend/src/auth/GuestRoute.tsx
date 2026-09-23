import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "./useAuth";

import { UserRole } from "../enums/role.enum";

import { ROUTES } from "../config/routes.config";

export default function GuestRoute() {
  const {
    isAuthenticated,
    role,
  } = useAuth();

  if (!isAuthenticated) {
    return <Outlet />;
  }

  if (role === UserRole.ADMIN) {
    return (
      <Navigate
        to={ROUTES.ADMIN.DASHBOARD}
        replace
      />
    );
  }

  if (
    role === UserRole.PROJECT_MANAGER
  ) {
    return (
      <Navigate
        to={
          ROUTES.PROJECT_MANAGER
            .DASHBOARD
        }
        replace
      />
    );
  }

  return (
    <Navigate
      to={ROUTES.LOGIN}
      replace
    />
  );
}