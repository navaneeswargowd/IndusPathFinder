import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  UserRole,
} from "../enums/role.enum";

import {
  ROUTES,
} from "../config/routes.config";

import AppLayout from "../layouts/AppLayout";
import AuthLayout from "../layouts/AuthLayout";

import ProtectedRoute from "../auth/ProtectedRoute";
import RoleRoute from "../auth/RoleRoute";
import GuestRoute from "../auth/GuestRoute";

import LandingPage from "../pages/LandingPage/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";

import ProjectManagerDashboardPage
  from "../pages/project-manager/ProjectManagerDashboardPage";

import NotificationsPage
  from "../pages/project-manager/NotificationsPage";

import ProfilePage
  from "../pages/project-manager/ProfilePage";

import ChangePasswordPage
  from "../pages/project-manager/ChangePasswordPage";

import ProjectListPage
  from "../pages/project-manager/projects/ProjectListPage";

import CreateProjectPage
  from "../pages/project-manager/projects/CreateProjectPage";

import EditProjectPage
  from "../pages/project-manager/projects/EditProjectPage";

import ProjectWorkspacePage
  from "../pages/project-manager/projects/ProjectWorkspacePage";

import UnauthorizedPage
  from "../pages/errors/UnauthorizedPage";

import NotFoundPage
  from "../pages/errors/NotFoundPage";
import CategoriesPage
  from "../pages/admin/categories/CategoriesPage";

import AuditLogsPage
  from "../pages/admin/audit-logs/AuditLogsPage";

import OrganizationsPage
  from "../pages/admin/organizations/OrganizationsPage";

export default function AppRouter() {
  return (
    <Routes>
      {/* ===================================================== */}
      {/* PUBLIC / GUEST ROUTES */}
      {/* ===================================================== */}
        <Route
        path="/"
        element={<LandingPage />}
      />



      <Route
        element={
          <GuestRoute />
        }
      >
        <Route
          element={
            <AuthLayout />
          }
        >
          <Route
            path={
              ROUTES.LOGIN
            }
            element={
              <LoginPage />
            }
          />

          <Route
            path={
              ROUTES.REGISTER
            }
            element={
              <RegisterPage />
            }
          />

          <Route
            path={
              ROUTES.FORGOT_PASSWORD
            }
            element={
              <ForgotPasswordPage />
            }
          />

          <Route
            path={
              ROUTES.VERIFY_OTP
            }
            element={
              <VerifyOtpPage />
            }
          />

          <Route
            path={
              ROUTES.RESET_PASSWORD
            }
            element={
              <ResetPasswordPage />
            }
          />
        </Route>
      </Route>

      {/* ===================================================== */}
      {/* AUTHENTICATED ROUTES */}
      {/* ===================================================== */}

      <Route
        element={
          <ProtectedRoute />
        }
      >
        {/* =================================================== */}
        {/* UNAUTHORIZED */}
        {/* =================================================== */}

        <Route
          path={
            ROUTES.UNAUTHORIZED
          }
          element={
            <UnauthorizedPage />
          }
        />

{/* =================================================== */}
{/* ADMIN */}
{/* =================================================== */}

<Route
  element={
    <RoleRoute
      allowedRoles={[
        UserRole.ADMIN,
      ]}
    />
  }
>
  <Route
    element={
      <AppLayout
        role={
          UserRole.ADMIN
        }
      />
    }
  >
    {/* DASHBOARD */}

    <Route
      path={
        ROUTES.ADMIN.DASHBOARD
      }
      element={
        <AdminDashboardPage />
      }
    />

    {/* ORGANIZATIONS */}

<Route
  path={
    ROUTES.ADMIN.ORGANIZATIONS
  }
  element={
    <OrganizationsPage />
  }
/>

    <Route
  path={
    ROUTES.ADMIN.CATEGORIES
  }
  element={
    <CategoriesPage />
  }
/>

    {/* NOTIFICATIONS */}

    <Route
      path={
        ROUTES.ADMIN.NOTIFICATIONS
      }
      element={
        <NotificationsPage />
      }
    />

    {/* PROFILE */}

    <Route
      path={
        ROUTES.ADMIN.PROFILE
      }
      element={
        <ProfilePage />
      }
    />
<Route
  path={
    ROUTES.ADMIN.AUDIT_LOGS
  }
  element={
    <AuditLogsPage />
  }
/>


    {/* CHANGE PASSWORD */}

    <Route
      path={
        ROUTES.ADMIN.CHANGE_PASSWORD
      }
      element={
        <ChangePasswordPage />
      }
    />

    {/* AUDIT LOGS - add page in next phase */}

    {/*
    <Route
      path={
        ROUTES.ADMIN.AUDIT_LOGS
      }
      element={
        <AuditLogsPage />
      }
    />
    */}
  </Route>
</Route>

        {/* =================================================== */}
        {/* PROJECT MANAGER */}
        {/* =================================================== */}

        <Route
          element={
            <RoleRoute
              allowedRoles={[
                UserRole.PROJECT_MANAGER,
              ]}
            />
          }
        >
          {/*
            IMPORTANT:

            Every Project Manager page is nested
            inside this AppLayout.

            Therefore these pages automatically get:

            Sidebar
            Header
            Breadcrumbs
            Main content area
          */}

          <Route
            element={
              <AppLayout
                role={
                  UserRole.PROJECT_MANAGER
                }
              />
            }
          >
            {/* =============================================== */}
            {/* DASHBOARD */}
            {/* =============================================== */}

            <Route
              path={
                ROUTES.PROJECT_MANAGER.DASHBOARD
              }
              element={
                <ProjectManagerDashboardPage />
              }
            />

            {/* =============================================== */}
            {/* PROJECT LIST */}
            {/* =============================================== */}

            <Route
              path={
                ROUTES.PROJECT_MANAGER.PROJECTS
              }
              element={
                <ProjectListPage />
              }
            />

            {/* =============================================== */}
            {/* CREATE PROJECT */}
            {/* =============================================== */}

            <Route
              path={
                ROUTES.PROJECT_MANAGER.PROJECT_CREATE
              }
              element={
                <CreateProjectPage />
              }
            />

            {/* =============================================== */}
            {/* PROJECT WORKSPACE */}
            {/* =============================================== */}

            <Route
              path={
                ROUTES.PROJECT_MANAGER.PROJECT_DETAILS
              }
              element={
                <ProjectWorkspacePage />
              }
            />

            {/* =============================================== */}
            {/* EDIT PROJECT */}
            {/* =============================================== */}

            <Route
              path={
                ROUTES.PROJECT_MANAGER.PROJECT_EDIT
              }
              element={
                <EditProjectPage />
              }
            />

            {/* =============================================== */}
            {/* NOTIFICATIONS */}
            {/* =============================================== */}

            <Route
              path={
                ROUTES.PROJECT_MANAGER.NOTIFICATIONS
              }
              element={
                <NotificationsPage />
              }
            />

            {/* =============================================== */}
            {/* PROFILE */}
            {/* =============================================== */}

            <Route
              path={
                ROUTES.PROJECT_MANAGER.PROFILE
              }
              element={
                <ProfilePage />
              }
            />

            {/* =============================================== */}
            {/* CHANGE PASSWORD */}
            {/* =============================================== */}

            <Route
              path={
                ROUTES.PROJECT_MANAGER.CHANGE_PASSWORD
              }
              element={
                <ChangePasswordPage />
              }
            />
          </Route>
        </Route>
      </Route>

      {/* ===================================================== */}
      {/* ROOT */}
      {/* ===================================================== */}

      <Route
        path={
          ROUTES.ROOT
        }
        element={
          <Navigate
            to={
              ROUTES.LOGIN
            }
            replace
          />
        }
      />

      {/* ===================================================== */}
      {/* 404 */}
      {/* ===================================================== */}

      <Route
        path="*"
        element={
          <NotFoundPage />
        }
      />
    </Routes>
  );
}