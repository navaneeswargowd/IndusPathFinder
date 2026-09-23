import {
  Badge,
  IconButton,
  Tooltip,
} from "@mui/material";

import {
  NotificationsNoneRounded,
} from "@mui/icons-material";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  useNavigate,
} from "react-router-dom";

import {
  searchNotificationPageApi,
} from "../../api/notification.api";

import {
  useAuth,
} from "../../auth/useAuth";

import {
  NotificationStatus,
} from "../../types/notification.types";

import {
  UserRole,
} from "../../enums/role.enum";

import {
  ROUTES,
} from "../../config/routes.config";

export default function NotificationBell() {
  const {
    user,
    role,
  } =
    useAuth();

  const navigate =
    useNavigate();

  const userId =
    user?.userId ??
    0;

  const query =
    useQuery({
      queryKey: [
        "header-notifications",
        userId,
      ],

      queryFn:
        () =>
          searchNotificationPageApi({
            userId,

            status:
              NotificationStatus.UNREAD,

            page:
              0,

            size:
              10,

            sortBy:
              "createdOn",

            direction:
              "desc",
          }),

      enabled:
        userId >
        0,

      refetchInterval:
        60_000,

      refetchOnWindowFocus:
        true,

      staleTime:
        15_000,
    });

  /*
   * Search request already contains
   * status = UNREAD.
   *
   * Therefore totalElements represents
   * total unread notifications.
   */

  const unreadCount =
    query.data
      ?.totalElements ??
    0;

  const notificationPath =
    role ===
    UserRole.ADMIN
      ? ROUTES
          .ADMIN
          .NOTIFICATIONS
      : ROUTES
          .PROJECT_MANAGER
          .NOTIFICATIONS;

  return (
    <Tooltip
      title={
        unreadCount >
        0
          ? `${unreadCount} unread notification${
              unreadCount ===
              1
                ? ""
                : "s"
            }`
          : "Notifications"
      }
    >
      <IconButton
        onClick={() =>
          navigate(
            notificationPath
          )
        }
        aria-label="Notifications"
        sx={{
          width:
            42,

          height:
            42,

          border:
            "1px solid",

          borderColor:
            "divider",

          backgroundColor:
            "#FFFFFF",

          "&:hover": {
            backgroundColor:
              "rgba(23,59,115,0.04)",
          },
        }}
      >
        <Badge
          badgeContent={
            unreadCount
          }
          color="error"
          max={
            99
          }
          invisible={
            unreadCount ===
            0
          }
        >
          <NotificationsNoneRounded />
        </Badge>
      </IconButton>
    </Tooltip>
  );
}