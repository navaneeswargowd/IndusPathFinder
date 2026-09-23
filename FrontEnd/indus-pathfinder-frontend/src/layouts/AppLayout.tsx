// src/layouts/AppLayout.tsx

import {
  Box,
  Drawer,
} from "@mui/material";

import {
  useState,
} from "react";

import {
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  DRAWER_WIDTH,
} from "../config/constants";

import type {
  UserRole,
} from "../enums/role.enum";

import {
  useAuth,
} from "../auth/useAuth";

import {
  ROUTES,
} from "../config/routes.config";

import Sidebar from "./Sidebar";
import Header from "./Header";
import PageContainer from "./PageContainer";
import BreadcrumbNavigation from "./BreadcrumbNavigation";

import LogoutConfirmDialog from "../components/dialogs/LogoutConfirmDialog";


interface AppLayoutProps {
  role: UserRole;
}

export default function AppLayout({
  role,
}: AppLayoutProps) {
  const {
    logout,
  } = useAuth();

  const navigate =
    useNavigate();

  const [
    mobileOpen,
    setMobileOpen,
  ] =
    useState(false);

  const [
    logoutDialogOpen,
    setLogoutDialogOpen,
  ] =
    useState(false);

  const [
    loggingOut,
    setLoggingOut,
  ] =
    useState(false);

  const handleDrawerToggle =
    () => {
      setMobileOpen(
        (previous) =>
          !previous
      );
    };

  const handleLogout =
    async () => {
      try {
        setLoggingOut(
          true
        );

        await logout();

        navigate(
          ROUTES.LOGIN,
          {
            replace: true,
          }
        );
      } finally {
        setLoggingOut(
          false
        );

        setLogoutDialogOpen(
          false
        );
      }
    };

  return (
    <Box
      sx={{
        display: "flex",

        minHeight:
          "100vh",

        backgroundColor:
          "background.default",
      }}
    >
      <Box
        component="nav"
        sx={{
          width: {
            lg:
              DRAWER_WIDTH,
          },

          flexShrink: {
            lg: 0,
          },
        }}
      >
        <Drawer
          variant="temporary"
          open={
            mobileOpen
          }
          onClose={
            handleDrawerToggle
          }
          ModalProps={{
            keepMounted:
              true,
          }}
          sx={{
            display: {
              xs: "block",
              lg: "none",
            },

            "& .MuiDrawer-paper":
              {
                width:
                  DRAWER_WIDTH,

                border: 0,
              },
          }}
        >
          <Sidebar
            role={role}
            onNavigate={() =>
              setMobileOpen(
                false
              )
            }
            onLogoutRequest={() =>
              setLogoutDialogOpen(
                true
              )
            }
          />
        </Drawer>

        <Drawer
          variant="permanent"
          open
          sx={{
            display: {
              xs: "none",
              lg: "block",
            },

            "& .MuiDrawer-paper":
              {
                width:
                  DRAWER_WIDTH,

                border: 0,
              },
          }}
        >
          <Sidebar
            role={role}
            onLogoutRequest={() =>
              setLogoutDialogOpen(
                true
              )
            }
          />
        </Drawer>
      </Box>

      <Box
        sx={{
          flexGrow: 1,

          minWidth: 0,

          display:
            "flex",

          flexDirection:
            "column",
        }}
      >
        <Header
          onMenuClick={
            handleDrawerToggle
          }
          onLogoutRequest={() =>
            setLogoutDialogOpen(
              true
            )
          }
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,

            minWidth: 0,
          }}
        >
          <PageContainer>
            <BreadcrumbNavigation />

            <Outlet />
          </PageContainer>
        </Box>
      </Box>

      <LogoutConfirmDialog
        open={
          logoutDialogOpen
        }
        loading={
          loggingOut
        }
        onClose={() =>
          setLogoutDialogOpen(
            false
          )
        }
        onConfirm={
          handleLogout
        }
      />
    </Box>
  );
}