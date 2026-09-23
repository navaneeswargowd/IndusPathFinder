import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  useAuth,
} from "./useAuth";

import {
  ROUTES,
} from "../config/routes.config";

export default function ProtectedRoute() {
  const {
    isAuthenticated,
  } = useAuth();

  const location =
    useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
}