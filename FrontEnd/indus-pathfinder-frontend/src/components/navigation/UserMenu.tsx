import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import {
  AccountCircleOutlined,
  KeyOutlined,
  LogoutOutlined,
} from "@mui/icons-material";

import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../auth/useAuth";

import {
  UserRole,
} from "../../enums/role.enum";

import {
  ROUTES,
} from "../../config/routes.config";

interface UserMenuProps {
  onLogoutRequest:
    () => void;
}

export default function UserMenu({
  onLogoutRequest,
}: UserMenuProps) {
  const {
    user,
    role,
  } =
    useAuth();

  const navigate =
    useNavigate();

  const [
    anchorEl,
    setAnchorEl,
  ] =
    useState<HTMLElement | null>(
      null
    );

  /*
   * ==========================================================
   * USER NAME
   * ==========================================================
   *
   * IMPORTANT:
   * Read directly from AuthContext.
   *
   * Do not fetch another profile here because
   * it can contain stale cached profile data.
   */

  const firstName =
    user?.firstName ??
    "";

  const lastName =
    user?.lastName ??
    "";

  const fullName =
    `${firstName} ${lastName}`
      .trim() ||
    user?.userName ||
    "User";

  /*
   * ==========================================================
   * INITIALS
   * ==========================================================
   */

  const initials =
    fullName
      .split(" ")
      .filter(
        Boolean
      )
      .map(
        part =>
          part
            .charAt(0)
            .toUpperCase()
      )
      .join("")
      .slice(
        0,
        2
      ) ||
    "U";

  /*
   * ==========================================================
   * ROLE BASED ROUTES
   * ==========================================================
   */

  const profilePath =
    role ===
    UserRole.ADMIN
      ? ROUTES.ADMIN.PROFILE
      : ROUTES
          .PROJECT_MANAGER
          .PROFILE;

  const passwordPath =
    role ===
    UserRole.ADMIN
      ? ROUTES
          .ADMIN
          .CHANGE_PASSWORD
      : ROUTES
          .PROJECT_MANAGER
          .CHANGE_PASSWORD;

  const roleLabel =
    role ===
    UserRole.ADMIN
      ? "Administrator"
      : role ===
          UserRole.PROJECT_MANAGER
        ? "Project Manager"
        : "User";

  return (
    <>
      {/* =================================================== */}
      {/* USER HEADER */}
      {/* =================================================== */}

      <Box
        onClick={(
          event
        ) =>
          setAnchorEl(
            event.currentTarget
          )
        }
        sx={{
          display:
            "flex",

          alignItems:
            "center",

          gap:
            1.1,

          px:
            0.6,

          py:
            0.4,

          borderRadius:
            2,

          cursor:
            "pointer",

          "&:hover": {
            backgroundColor:
              "rgba(23,59,115,0.045)",
          },
        }}
      >
        <Avatar
          sx={{
            width:
              39,

            height:
              39,

            background:
              "linear-gradient(135deg, #173B73, #0D92B8)",

            fontSize:
              "0.8rem",

            fontWeight:
              750,
          }}
        >
          {initials}
        </Avatar>

        <Box
          sx={{
            display: {
              xs:
                "none",

              sm:
                "block",
            },

            maxWidth:
              180,
          }}
        >
          <Typography
            sx={{
              fontSize:
                "0.8rem",

              fontWeight:
                700,

              overflow:
                "hidden",

              whiteSpace:
                "nowrap",

              textOverflow:
                "ellipsis",
            }}
          >
            {fullName}
          </Typography>

          <Typography
            sx={{
              fontSize:
                "0.68rem",

              color:
                "text.secondary",

              overflow:
                "hidden",

              whiteSpace:
                "nowrap",

              textOverflow:
                "ellipsis",
            }}
          >
            {roleLabel}
          </Typography>
        </Box>
      </Box>

      {/* =================================================== */}
      {/* USER MENU */}
      {/* =================================================== */}

      <Menu
        anchorEl={
          anchorEl
        }
        open={
          Boolean(
            anchorEl
          )
        }
        onClose={() =>
          setAnchorEl(
            null
          )
        }
        slotProps={{
          paper: {
            sx: {
              mt:
                1,

              width:
                260,

              border:
                "1px solid",

              borderColor:
                "divider",

              boxShadow:
                "0 18px 55px rgba(18,38,63,0.15)",
            },
          },
        }}
      >
        <Box
          sx={{
            px:
              2,

            py:
              1.5,
          }}
        >
          <Typography
            sx={{
              fontWeight:
                700,
            }}
          >
            {fullName}
          </Typography>

          <Typography
            sx={{
              mt:
                0.3,

              color:
                "text.secondary",

              fontSize:
                "0.72rem",

              wordBreak:
                "break-word",
            }}
          >
            {user?.email}
          </Typography>

          <Typography
            sx={{
              mt:
                0.2,

              color:
                "text.secondary",

              fontSize:
                "0.65rem",
            }}
          >
            {roleLabel}
          </Typography>
        </Box>

        <Divider />

        <MenuItem
          onClick={() => {
            setAnchorEl(
              null
            );

            navigate(
              profilePath
            );
          }}
        >
          <ListItemIcon>
            <AccountCircleOutlined fontSize="small" />
          </ListItemIcon>

          My Profile
        </MenuItem>

        <MenuItem
          onClick={() => {
            setAnchorEl(
              null
            );

            navigate(
              passwordPath
            );
          }}
        >
          <ListItemIcon>
            <KeyOutlined fontSize="small" />
          </ListItemIcon>

          Change Password
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => {
            setAnchorEl(
              null
            );

            onLogoutRequest();
          }}
          sx={{
            color:
              "error.main",
          }}
        >
          <ListItemIcon
            sx={{
              color:
                "error.main",
            }}
          >
            <LogoutOutlined fontSize="small" />
          </ListItemIcon>

          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
}