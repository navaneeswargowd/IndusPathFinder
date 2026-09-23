// src/layouts/Header.tsx

import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

import {
  MenuRounded,
} from "@mui/icons-material";

import NotificationBell from "../components/notifications/NotificationBell";
import UserMenu from "../components/navigation/UserMenu";

interface HeaderProps {
  onMenuClick:
    () => void;

  onLogoutRequest:
    () => void;
}

export default function Header({
  onMenuClick,
  onLogoutRequest,
}: HeaderProps) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor:
          "rgba(255,255,255,0.94)",

        backdropFilter:
          "blur(16px)",

        color:
          "text.primary",

        borderBottom:
          "1px solid rgba(226,232,240,0.95)",
      }}
    >
      <Toolbar
        sx={{
          minHeight:
            "72px !important",

          gap: 1.3,

          px: {
            xs: 2,
            md: 3,
          },
        }}
      >
        <IconButton
          edge="start"
          onClick={
            onMenuClick
          }
          sx={{
            display: {
              xs: "inline-flex",
              lg: "none",
            },
          }}
        >
          <MenuRounded />
        </IconButton>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "0.9rem",
                sm: "1rem",
              },

              fontWeight: 750,

              letterSpacing:
                "-0.015em",
            }}
          >
            Project Intelligence Workspace
          </Typography>

          <Typography
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },

              mt: 0.1,

              color:
                "text.secondary",

              fontSize:
                "0.7rem",
            }}
          >
            Plan • Analyze • Deliver
          </Typography>
        </Box>

        <NotificationBell />

        <UserMenu
          onLogoutRequest={
            onLogoutRequest
          }
        />
      </Toolbar>
    </AppBar>
  );
}