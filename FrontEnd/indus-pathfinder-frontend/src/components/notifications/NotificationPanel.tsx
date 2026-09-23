import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Popover,
  Typography,
} from "@mui/material";

import {
  DoneAllRounded,
  NotificationsNoneRounded,
} from "@mui/icons-material";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  useSnackbar,
} from "notistack";

import {
  useNavigate,
} from "react-router-dom";

import {
  searchNotificationPageApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
} from "../../api/notification.api";

import {
  useAuth,
} from "../../auth/useAuth";

import {
  NotificationStatus,
  type NotificationResponse,
} from "../../types/notification.types";

import {
  getErrorMessage,
} from "../../utils/error.utils";

import {
  ROUTES,
} from "../../config/routes.config";

import NotificationItem from "./NotificationItem";

interface NotificationPanelProps {
  anchorEl:
    HTMLElement | null;

  open:
    boolean;

  onClose:
    () => void;
}

export default function NotificationPanel({
  anchorEl,
  open,
  onClose,
}: NotificationPanelProps) {
  const {
    user,
    role,
  } =
    useAuth();

  const navigate =
    useNavigate();

  const queryClient =
    useQueryClient();

  const {
    enqueueSnackbar,
  } =
    useSnackbar();

  const userId =
    user?.userId ??
    0;

  /*
   * ==========================================================
   * LOAD HEADER NOTIFICATIONS
   * ==========================================================
   */

  const notificationsQuery =
    useQuery({
      queryKey: [
        "header-notifications",
        userId,
      ],

      queryFn:
        () =>
          searchNotificationPageApi({
            userId,

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
        open &&
        userId >
          0,

      staleTime:
        20_000,
    });

  /*
   * searchNotificationPageApi returns:
   *
   * PageResponse<NotificationResponse>
   */

  const notifications:
    NotificationResponse[] =
      notificationsQuery
        .data
        ?.content ??
      [];

  const unreadCount =
    notifications.filter(
      (
        notification:
          NotificationResponse
      ) =>
        notification.status ===
        NotificationStatus.UNREAD
    ).length;

  /*
   * ==========================================================
   * MARK ONE AS READ
   * ==========================================================
   */

  const readMutation =
    useMutation({
      mutationFn:
        markNotificationReadApi,

      onSuccess:
        () => {
          /*
           * Refresh bell/panel
           */
          void queryClient.invalidateQueries({
            queryKey: [
              "header-notifications",
              userId,
            ],
          });

          /*
           * Refresh full Notifications page too
           */
          void queryClient.invalidateQueries({
            queryKey: [
              "notifications",
            ],
          });
        },

      onError:
        (
          error
        ) => {
          enqueueSnackbar(
            getErrorMessage(
              error
            ),
            {
              variant:
                "error",
            }
          );
        },
    });

  /*
   * ==========================================================
   * MARK ALL AS READ
   * ==========================================================
   */

  const readAllMutation =
    useMutation({
      mutationFn:
        () =>
          markAllNotificationsReadApi(
            userId
          ),

      onSuccess:
        () => {
          enqueueSnackbar(
            "All notifications marked as read.",
            {
              variant:
                "success",
            }
          );

          void queryClient.invalidateQueries({
            queryKey: [
              "header-notifications",
              userId,
            ],
          });

          void queryClient.invalidateQueries({
            queryKey: [
              "notifications",
            ],
          });
        },

      onError:
        (
          error
        ) => {
          enqueueSnackbar(
            getErrorMessage(
              error
            ),
            {
              variant:
                "error",
            }
          );
        },
    });

  /*
   * ==========================================================
   * NOTIFICATION CLICK
   * ==========================================================
   */

  const handleNotificationClick =
    (
      notification:
        NotificationResponse
    ) => {
      if (
        notification.status ===
        NotificationStatus.UNREAD
      ) {
        readMutation.mutate({
          notificationId:
            notification.notificationId,

          userId:
            notification.userId,
        });
      }
    };

  /*
   * ==========================================================
   * VIEW ALL
   * ==========================================================
   */

  const handleViewAll =
    () => {
      onClose();

      if (
        role ===
        "ADMIN"
      ) {
        navigate(
          ROUTES
            .ADMIN
            .NOTIFICATIONS
        );

        return;
      }

      navigate(
        ROUTES
          .PROJECT_MANAGER
          .NOTIFICATIONS
      );
    };

  return (
    <Popover
      open={
        open
      }
      anchorEl={
        anchorEl
      }
      onClose={
        onClose
      }
      anchorOrigin={{
        vertical:
          "bottom",

        horizontal:
          "right",
      }}
      transformOrigin={{
        vertical:
          "top",

        horizontal:
          "right",
      }}
      slotProps={{
        paper: {
          sx: {
            width:
              390,

            maxWidth:
              "calc(100vw - 24px)",

            mt:
              1,

            overflow:
              "hidden",

            border:
              "1px solid",

            borderColor:
              "divider",

            boxShadow:
              "0 22px 60px rgba(18,38,63,0.16)",
          },
        },
      }}
    >
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <Box
        sx={{
          px:
            2,

          py:
            1.7,

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight:
                750,
            }}
          >
            Notifications
          </Typography>

          <Typography
            sx={{
              mt:
                0.2,

              color:
                "text.secondary",

              fontSize:
                "0.72rem",
            }}
          >
            {unreadCount >
            0
              ? `${unreadCount} unread`
              : "You're all caught up"}
          </Typography>
        </Box>

        {unreadCount >
          0 && (
          <Button
            size="small"
            startIcon={
              <DoneAllRounded />
            }
            disabled={
              readAllMutation
                .isPending
            }
            onClick={() =>
              readAllMutation.mutate()
            }
          >
            Mark all read
          </Button>
        )}
      </Box>

      <Divider />

      {/* ================================================== */}
      {/* BODY */}
      {/* ================================================== */}

      <Box
        sx={{
          maxHeight:
            420,

          overflowY:
            "auto",
        }}
      >
        {notificationsQuery
          .isLoading && (
          <Box
            sx={{
              py:
                5,

              display:
                "flex",

              justifyContent:
                "center",
            }}
          >
            <CircularProgress
              size={
                28
              }
            />
          </Box>
        )}

        {notificationsQuery
          .isError && (
          <Box
            sx={{
              px:
                3,

              py:
                4,

              textAlign:
                "center",
            }}
          >
            <Typography
              color="error"
              sx={{
                fontSize:
                  "0.78rem",
              }}
            >
              Unable to load
              notifications.
            </Typography>
          </Box>
        )}

        {!notificationsQuery
          .isLoading &&
          !notificationsQuery
            .isError &&
          notifications.length ===
            0 && (
            <Box
              sx={{
                py:
                  5,

                px:
                  3,

                textAlign:
                  "center",
              }}
            >
              <NotificationsNoneRounded
                sx={{
                  fontSize:
                    38,

                  color:
                    "text.disabled",
                }}
              />

              <Typography
                sx={{
                  mt:
                    1,

                  color:
                    "text.secondary",

                  fontSize:
                    "0.8rem",
                }}
              >
                No notifications
                available.
              </Typography>
            </Box>
          )}

        {notifications.map(
          (
            notification:
              NotificationResponse
          ) => (
            <NotificationItem
              key={
                notification
                  .notificationId
              }
              notification={
                notification
              }
              onClick={
                handleNotificationClick
              }
            />
          )
        )}
      </Box>

      <Divider />

      {/* ================================================== */}
      {/* VIEW ALL */}
      {/* ================================================== */}

      <Box
        sx={{
          p:
            1,
        }}
      >
        <Button
          fullWidth
          onClick={
            handleViewAll
          }
        >
          View All Notifications
        </Button>
      </Box>
    </Popover>
  );
}