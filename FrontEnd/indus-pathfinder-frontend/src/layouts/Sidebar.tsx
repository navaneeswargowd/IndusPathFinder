import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import {
  AccountTreeRounded,
  LogoutRounded,
} from "@mui/icons-material";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  navigationItems,
} from "../config/navigation.config";

import {
  APP_NAME,
  APP_TAGLINE,
} from "../config/constants";

import type {
  UserRole,
} from "../enums/role.enum";



interface SidebarProps {
  role: UserRole;

  onNavigate?: () => void;

  onLogoutRequest: () => void;
}

export default function Sidebar({
  role,
  onNavigate,
  onLogoutRequest,
}: SidebarProps)  {
  const location =
    useLocation();

  const navigate =
    useNavigate();



  const visibleItems =
    navigationItems.filter(
      (item) =>
        item.roles.includes(
          role
        )
    );

  const handleNavigate = (
    path: string
  ) => {
    navigate(path);

    onNavigate?.();
  };



  return (
    <Box
      sx={{
        height: "100%",

        display: "flex",
        flexDirection:
          "column",

        background:
          "linear-gradient(180deg, #102D58 0%, #0A1F3D 58%, #07172E 100%)",

        color: "#FFFFFF",

        position: "relative",

        overflow: "hidden",

        "&::before": {
          content: '""',

          position:
            "absolute",

          width: 220,
          height: 220,

          top: -110,
          right: -120,

          borderRadius:
            "50%",

          background:
            "radial-gradient(circle, rgba(25,156,201,0.22), transparent 68%)",

          pointerEvents:
            "none",
        },

        "&::after": {
          content: '""',

          position:
            "absolute",

          width: 200,
          height: 200,

          bottom: 40,
          left: -130,

          borderRadius:
            "50%",

          background:
            "radial-gradient(circle, rgba(62,114,220,0.12), transparent 68%)",

          pointerEvents:
            "none",
        },
      }}
    >
      {/* ======================================== */}
      {/* BRAND */}
      {/* ======================================== */}

      <Box
        sx={{
          position: "relative",
          zIndex: 1,

          px: 2.5,
          pt: 3,
          pb: 2.5,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,

            borderRadius: 3,

            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",

            background:
              "linear-gradient(135deg, #2E87D3, #11A8C5)",

            boxShadow:
              "0 8px 24px rgba(13,146,184,0.32)",

            mb: 1.8,
          }}
        >
          <AccountTreeRounded />
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,

            letterSpacing:
              "-0.03em",
          }}
        >
          {APP_NAME}
        </Typography>

        <Typography
          sx={{
            mt: 0.5,

            fontSize:
              "0.69rem",

            color:
              "rgba(255,255,255,0.58)",

            lineHeight: 1.5,

            maxWidth: 220,
          }}
        >
          {APP_TAGLINE}
        </Typography>
      </Box>

      <Divider
        sx={{
          position: "relative",
          zIndex: 1,

          borderColor:
            "rgba(255,255,255,0.08)",
        }}
      />

      {/* ======================================== */}
      {/* NAVIGATION */}
      {/* ======================================== */}

      <Box
        sx={{
          position: "relative",
          zIndex: 1,

          flex: 1,

          overflowY: "auto",

          px: 1.4,
          py: 2,

          "&::-webkit-scrollbar":
            {
              width: 4,
            },

          "&::-webkit-scrollbar-thumb":
            {
              borderRadius: 10,

              backgroundColor:
                "rgba(255,255,255,0.12)",
            },
        }}
      >
        <Typography
          sx={{
            px: 1.5,
            mb: 1,

            color:
              "rgba(255,255,255,0.42)",

            fontSize:
              "0.65rem",

            fontWeight: 750,

            letterSpacing:
              "0.14em",
          }}
        >
          WORKSPACE
        </Typography>

        <List disablePadding>
          {visibleItems.map(
            (item) => {
              const Icon =
                item.icon;

              const selected =
                location.pathname ===
                  item.path ||
                location.pathname.startsWith(
                  `${item.path}/`
                );

              return (
                <ListItemButton
                  key={`${role}-${item.path}`}
                  selected={
                    selected
                  }
                  onClick={() =>
                    handleNavigate(
                      item.path
                    )
                  }
                  sx={{
                    position:
                      "relative",

                    minHeight: 46,

                    mb: 0.6,

                    px: 1.5,

                    borderRadius:
                      2.5,

                    transition:
                      "all 160ms ease",

                    color:
                      selected
                        ? "#FFFFFF"
                        : "rgba(255,255,255,0.70)",

                    "& .MuiListItemIcon-root":
                      {
                        color:
                          selected
                            ? "#70D5EB"
                            : "rgba(255,255,255,0.52)",
                      },

                    "&.Mui-selected":
                      {
                        background:
                          "linear-gradient(90deg, rgba(39,129,211,0.28), rgba(17,168,197,0.11))",

                        boxShadow:
                          "inset 0 0 0 1px rgba(112,213,235,0.05)",

                        "&::before":
                          {
                            content:
                              '""',

                            position:
                              "absolute",

                            left: 0,

                            top: "50%",

                            transform:
                              "translateY(-50%)",

                            height: 25,

                            width: 3,

                            borderRadius:
                              "0 3px 3px 0",

                            backgroundColor:
                              "#58CBE2",

                            boxShadow:
                              "0 0 12px rgba(88,203,226,0.35)",
                          },
                      },

                    "&.Mui-selected:hover":
                      {
                        background:
                          "linear-gradient(90deg, rgba(39,129,211,0.33), rgba(17,168,197,0.14))",
                      },

                    "&:hover":
                      {
                        backgroundColor:
                          "rgba(255,255,255,0.055)",

                        transform:
                          "translateX(2px)",
                      },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth:
                        40,
                    }}
                  >
                    <Icon
                      fontSize="small"
                    />
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      item.label
                    }
                    slotProps={{
                      primary: {
                        sx: {
                          fontSize:
                            "0.87rem",

                          fontWeight:
                            selected
                              ? 650
                              : 500,
                        },
                      },
                    }}
                  />
                </ListItemButton>
              );
            }
          )}
        </List>
      </Box>

      {/* ======================================== */}
      {/* LOGOUT */}
      {/* ======================================== */}

      <Box
        sx={{
          position: "relative",
          zIndex: 1,

          px: 1.4,
          pb: 2,
        }}
      >
        <Divider
          sx={{
            borderColor:
              "rgba(255,255,255,0.08)",

            mb: 1.5,
          }}
        />

        <ListItemButton
  onClick={() => {
    onNavigate?.();

    onLogoutRequest();
  }}
          sx={{
            borderRadius: 2.5,

            color:
              "rgba(255,255,255,0.68)",

            transition:
              "all 160ms ease",

            "&:hover": {
              backgroundColor:
                "rgba(220,68,68,0.09)",

              color: "#FFFFFF",

              "& .MuiListItemIcon-root":
                {
                  color:
                    "#FF8F8F",
                },
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,

              color:
                "rgba(255,255,255,0.52)",
            }}
          >
            <LogoutRounded
              fontSize="small"
            />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
            slotProps={{
              primary: {
                sx: {
                  fontSize:
                    "0.87rem",

                  fontWeight:
                    500,
                },
              },
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}