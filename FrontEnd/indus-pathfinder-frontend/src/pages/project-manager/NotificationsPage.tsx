import {
  DeleteOutlineRounded,
  DoneAllRounded,
  MarkEmailReadRounded,
  NotificationsNoneRounded,
  RefreshRounded,
  SearchRounded,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  useState,
} from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  useSnackbar,
} from "notistack";

import {
  deleteNotificationApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
  searchNotificationsApi,
} from "../../api/notification.api";

import {
  NotificationStatus,
} from "../../types/notification.types";

import type {
  NotificationResponse,
} from "../../types/notification.types";

import {
  getErrorMessage,
} from "../../utils/error.utils";
import {
  useAuth,
} from "../../auth/useAuth";
export default function NotificationsPage() {
  const {
    enqueueSnackbar,
  } =
    useSnackbar();

  const queryClient =
    useQueryClient();

  /*
   * =====================================================
   * USER ID
   * =====================================================
   *
   * Your LoginResponse already returns userId.
   *
   * If your AuthContext already stores userId,
   * later replace this localStorage logic with:
   *
   * const { user } = useAuth();
   * const userId = user?.userId ?? 0;
   *
   * For now this works if login stores userId.
   * =====================================================
   */
const {
  user,
} = useAuth();

const userId =
  user?.userId ??
  0;

  const [
    search,
    setSearch,
  ] =
    useState(
      ""
    );

  const [
    status,
    setStatus,
  ] =
    useState<
      "" | NotificationStatus
    >(
      ""
    );

  const [
    page,
    setPage,
  ] =
    useState(
      0
    );

  const [
    size,
    setSize,
  ] =
    useState(
      10
    );

  /*
   * =====================================================
   * SEARCH NOTIFICATIONS
   * =====================================================
   */

  const notificationQuery =
    useQuery({
      queryKey: [
        "notifications",
        userId,
        search,
        status,
        page,
        size,
      ],

      queryFn:
        () =>
          searchNotificationsApi({
            userId,

            title:
              search.trim() ||
              undefined,

            status:
              status ||
              undefined,

            page,

            size,

            sortBy:
              "createdOn",

            direction:
              "desc",
          }),

      enabled:
        userId > 0,
    });

  /*
   * =====================================================
   * REFRESH
   * =====================================================
   */

  const refreshNotifications =
    () => {
      void queryClient.invalidateQueries({
        queryKey: [
          "notifications",
        ],
      });
    };

  /*
   * =====================================================
   * MARK ONE AS READ
   * =====================================================
   */

  const markReadMutation =
    useMutation({
      mutationFn:
        markNotificationReadApi,

      onSuccess:
        (
          response
        ) => {
          enqueueSnackbar(
            response.message ||
              "Notification marked as read.",
            {
              variant:
                "success",
            }
          );

          refreshNotifications();
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
   * =====================================================
   * MARK ALL AS READ
   * =====================================================
   */

  const markAllMutation =
    useMutation({
      mutationFn:
        markAllNotificationsReadApi,

      onSuccess:
        (
          response
        ) => {
          enqueueSnackbar(
            response.message ||
              "All notifications marked as read.",
            {
              variant:
                "success",
            }
          );

          refreshNotifications();
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
   * =====================================================
   * DELETE
   * =====================================================
   */

  const deleteMutation =
    useMutation({
      mutationFn:
        deleteNotificationApi,

      onSuccess:
        (
          response
        ) => {
          enqueueSnackbar(
            response.message ||
              "Notification deleted.",
            {
              variant:
                "success",
            }
          );

          refreshNotifications();
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
   * Backend:
   *
   * ApiResponse<
   *   PageResponse<
   *     NotificationResponse
   *   >
   * >
   */

  const notifications:
    NotificationResponse[] =
      notificationQuery.data
        ?.data
        ?.content ??
      [];

  const totalElements =
    notificationQuery.data
      ?.data
      ?.totalElements ??
    0;

  const unreadCount =
    notifications.filter(
      (
        notification
      ) =>
        notification.status ===
        NotificationStatus.UNREAD
    ).length;

  return (
    <Box>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <Paper
        elevation={0}
        sx={{
          mb:
            2,

          p: {
            xs:
              2,

            md:
              2.5,
          },

          display:
            "flex",

          flexDirection: {
            xs:
              "column",

            md:
              "row",
          },

          alignItems: {
            xs:
              "flex-start",

            md:
              "center",
          },

          justifyContent:
            "space-between",

          gap:
            2,

          border:
            "1px solid",

          borderColor:
            "divider",

          borderRadius:
            2.5,

          background:
            "linear-gradient(135deg, #F8FAFC 0%, #EEF7F8 100%)",
        }}
      >
        <Box
          sx={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              1.4,
          }}
        >
          <Box
            sx={{
              width:
                46,

              height:
                46,

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              flexShrink:
                0,

              borderRadius:
                2.2,

              color:
                "#078E91",

              backgroundColor:
                "#E8F7F7",
            }}
          >
            <NotificationsNoneRounded />
          </Box>

          <Box>
            <Box
              sx={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  1,
              }}
            >
              <Typography
                sx={{
                  fontSize:
                    "1rem",

                  fontWeight:
                    760,
                }}
              >
                Notifications
              </Typography>

              {unreadCount >
                0 && (
                <Chip
                  size="small"
                  label={`${unreadCount} unread`}
                  sx={{
                    height:
                      22,

                    fontSize:
                      "0.62rem",

                    fontWeight:
                      700,

                    color:
                      "#B54708",

                    backgroundColor:
                      "#FFFAEB",
                  }}
                />
              )}
            </Box>

            <Typography
              sx={{
                mt:
                  0.3,

                color:
                  "text.secondary",

                fontSize:
                  "0.72rem",
              }}
            >
              View project, analysis and
              report notifications.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display:
              "flex",

            gap:
              1,

            flexWrap:
              "wrap",
          }}
        >
          <Button
            variant="outlined"
            startIcon={
              <RefreshRounded />
            }
            disabled={
              notificationQuery
                .isFetching
            }
            onClick={() =>
              notificationQuery.refetch()
            }
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={
              <DoneAllRounded />
            }
            disabled={
              markAllMutation
                .isPending ||
              userId <=
                0
            }
            onClick={() =>
              markAllMutation.mutate(
                userId
              )
            }
            sx={{
              backgroundColor:
                "#078E91",

              "&:hover":
                {
                  backgroundColor:
                    "#067A7D",
                },
            }}
          >
            Mark All Read
          </Button>
        </Box>
      </Paper>

      {/* ================================================= */}
      {/* FILTER BAR */}
      {/* ================================================= */}

      <Paper
        elevation={0}
        sx={{
          mb:
            1.5,

          p:
            1.5,

          display:
            "grid",

          gridTemplateColumns: {
            xs:
              "1fr",

            md:
              "minmax(250px,1fr) 190px",
          },

          gap:
            1,

          border:
            "1px solid",

          borderColor:
            "divider",

          borderRadius:
            2.5,
        }}
      >
        <TextField
          size="small"
          placeholder="Search notifications..."
          value={
            search
          }
          onChange={(
            event
          ) => {
            setSearch(
              event.target.value
            );

            setPage(
              0
            );
          }}
          slotProps={{
            input: {
              startAdornment:
                (
                  <InputAdornment position="start">
                    <SearchRounded
                      sx={{
                        fontSize:
                          19,

                        color:
                          "text.disabled",
                      }}
                    />
                  </InputAdornment>
                ),
            },
          }}
        />

       <TextField
  select
  size="small"
  value={
    status
  }
  onChange={(
    event
  ) => {
    setStatus(
      event.target
        .value as
        | ""
        | NotificationStatus
    );

    setPage(
      0
    );
  }}
  slotProps={{
    select: {
      displayEmpty:
        true,

      renderValue: (
        selected
      ) => {
        if (
          !selected
        ) {
          return (
            <Box
              component="span"
              sx={{
                color:
                  "text.disabled",
              }}
            >
              Notification Type
            </Box>
          );
        }

        if (
          selected ===
          NotificationStatus.UNREAD
        ) {
          return "Unread";
        }

        if (
          selected ===
          NotificationStatus.READ
        ) {
          return "Read";
        }

        return selected as string;
      },
    },
  }}
>
  <MenuItem value="">
    All Notifications
  </MenuItem>

  <MenuItem
    value={
      NotificationStatus.UNREAD
    }
  >
    Unread
  </MenuItem>

  <MenuItem
    value={
      NotificationStatus.READ
    }
  >
    Read
  </MenuItem>
</TextField>
      </Paper>

      {/* ================================================= */}
      {/* LOADING */}
      {/* ================================================= */}

      {notificationQuery.isLoading && (
        <Paper
          elevation={0}
          sx={{
            minHeight:
              260,

            display:
              "flex",

            flexDirection:
              "column",

            alignItems:
              "center",

            justifyContent:
              "center",

            border:
              "1px solid",

            borderColor:
              "divider",

            borderRadius:
              2.5,
          }}
        >
          <CircularProgress
            size={
              32
            }
          />

          <Typography
            sx={{
              mt:
                1.5,

              color:
                "text.secondary",

              fontSize:
                "0.73rem",
            }}
          >
            Loading notifications...
          </Typography>
        </Paper>
      )}

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {notificationQuery.isError && (
        <Paper
          elevation={0}
          sx={{
            p:
              4,

            textAlign:
              "center",

            border:
              "1px solid",

            borderColor:
              "error.light",

            borderRadius:
              2.5,
          }}
        >
          <Typography
            color="error"
            sx={{
              fontWeight:
                700,
            }}
          >
            Unable to load notifications.
          </Typography>

          <Button
            sx={{
              mt:
                1,
            }}
            onClick={() =>
              notificationQuery.refetch()
            }
          >
            Try Again
          </Button>
        </Paper>
      )}

      {/* ================================================= */}
      {/* NOTIFICATION LIST */}
      {/* ================================================= */}

      {!notificationQuery.isLoading &&
        !notificationQuery.isError && (
        <Paper
          elevation={0}
          sx={{
            border:
              "1px solid",

            borderColor:
              "divider",

            borderRadius:
              2.5,

            overflow:
              "hidden",
          }}
        >
          {notifications.map(
            (
              notification
            ) => {
              const unread =
                notification.status ===
                NotificationStatus.UNREAD;

              return (
                <Box
                  key={
                    notification.notificationId
                  }
                  sx={{
                    px: {
                      xs:
                        1.5,

                      md:
                        2,
                    },

                    py:
                      1.7,

                    display:
                      "grid",

                    gridTemplateColumns:
                      "auto minmax(0, 1fr) auto",

                    gap:
                      1.4,

                    alignItems:
                      "center",

                    borderBottom:
                      "1px solid",

                    borderColor:
                      "divider",

                    backgroundColor:
                      unread
                        ? "#F4FBFB"
                        : "#FFFFFF",

                    transition:
                      "background-color 150ms ease",

                    "&:hover":
                      {
                        backgroundColor:
                          unread
                            ? "#EEF9F9"
                            : "#FAFBFC",
                      },
                  }}
                >
                  {/* ICON */}

                  <Box
                    sx={{
                      width:
                        40,

                      height:
                        40,

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      borderRadius:
                        2,

                      color:
                        unread
                          ? "#078E91"
                          : "#667085",

                      backgroundColor:
                        unread
                          ? "#E8F7F7"
                          : "#F2F4F7",
                    }}
                  >
                    <NotificationsNoneRounded
                      sx={{
                        fontSize:
                          20,
                      }}
                    />
                  </Box>

                  {/* CONTENT */}

                  <Box
                    sx={{
                      minWidth:
                        0,
                    }}
                  >
                    <Box
                      sx={{
                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap:
                          0.8,

                        flexWrap:
                          "wrap",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize:
                            "0.81rem",

                          fontWeight:
                            unread
                              ? 750
                              : 650,
                        }}
                      >
                        {
                          notification.title
                        }
                      </Typography>

                      {unread && (
                        <Chip
                          label="New"
                          size="small"
                          sx={{
                            height:
                              19,

                            fontSize:
                              "0.56rem",

                            fontWeight:
                              750,

                            color:
                              "#067647",

                            backgroundColor:
                              "#ECFDF3",
                          }}
                        />
                      )}
                    </Box>

                    <Typography
                      sx={{
                        mt:
                          0.35,

                        color:
                          "text.secondary",

                        fontSize:
                          "0.7rem",

                        lineHeight:
                          1.55,
                      }}
                    >
                      {
                        notification.message
                      }
                    </Typography>

                    <Typography
                      sx={{
                        mt:
                          0.5,

                        color:
                          "text.disabled",

                        fontSize:
                          "0.62rem",
                      }}
                    >
                      {formatDateTime(
                        notification.createdOn
                      )}
                    </Typography>
                  </Box>

                  {/* ACTIONS */}

                  <Box
                    sx={{
                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap:
                        0.2,
                    }}
                  >
                    {unread && (
                      <Tooltip title="Mark as read">
                        <IconButton
                          size="small"
                          disabled={
                            markReadMutation
                              .isPending
                          }
                          onClick={() =>
                            markReadMutation.mutate({
                              notificationId:
                                notification.notificationId,

                              userId,
                            })
                          }
                        >
                          <MarkEmailReadRounded
                            sx={{
                              fontSize:
                                18,
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="Delete notification">
                      <IconButton
                        size="small"
                        color="error"
                        disabled={
                          deleteMutation
                            .isPending
                        }
                        onClick={() =>
                          deleteMutation.mutate({
                            notificationId:
                              notification.notificationId,

                            userId,
                          })
                        }
                      >
                        <DeleteOutlineRounded
                          sx={{
                            fontSize:
                              18,
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              );
            }
          )}

          {/* EMPTY */}

          {notifications.length ===
            0 && (
            <Box
              sx={{
                py:
                  8,

                px:
                  2,

                textAlign:
                  "center",
              }}
            >
              <Box
                sx={{
                  width:
                    60,

                  height:
                    60,

                  mx:
                    "auto",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  borderRadius:
                    "50%",

                  color:
                    "text.disabled",

                  backgroundColor:
                    "#F2F4F7",
                }}
              >
                <NotificationsNoneRounded
                  sx={{
                    fontSize:
                      30,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  mt:
                    1.5,

                  fontSize:
                    "0.85rem",

                  fontWeight:
                    700,
                }}
              >
                No notifications found
              </Typography>

              <Typography
                sx={{
                  mt:
                    0.5,

                  color:
                    "text.secondary",

                  fontSize:
                    "0.7rem",
                }}
              >
                New project and analysis
                notifications will appear
                here.
              </Typography>
            </Box>
          )}

          {/* PAGINATION */}

          <TablePagination
            component="div"
            count={
              totalElements
            }
            page={
              page
            }
            rowsPerPage={
              size
            }
            rowsPerPageOptions={[
              5,
              10,
              25,
              50,
            ]}
            onPageChange={(
              _,
              newPage
            ) =>
              setPage(
                newPage
              )
            }
            onRowsPerPageChange={(
              event
            ) => {
              setSize(
                Number(
                  event.target.value
                )
              );

              setPage(
                0
              );
            }}
          />
        </Paper>
      )}
    </Box>
  );
}

function formatDateTime(
  value:
    string
) {
  if (
    !value
  ) {
    return "";
  }

  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleString();
}