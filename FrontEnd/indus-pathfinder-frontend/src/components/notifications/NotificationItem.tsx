import {
  Box,
  Typography,
} from "@mui/material";

import {
  Circle,
} from "@mui/icons-material";

import type {
  NotificationResponse,
} from "../../types/notification.types";

import {
  NotificationStatus,
} from "../../types/notification.types";

import {
  formatDateTime,
} from "../../utils/date.utils";

interface NotificationItemProps {
  notification:
    NotificationResponse;

  onClick: (
    notification:
      NotificationResponse
  ) => void;
}

export default function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const unread =
    notification.status ===
    NotificationStatus.UNREAD;

  return (
    <Box
      onClick={() =>
        onClick(notification)
      }
      sx={{
        position: "relative",

        px: 2,
        py: 1.6,

        cursor: "pointer",

        borderBottom:
          "1px solid",

        borderColor:
          "divider",

        backgroundColor:
          unread
            ? "rgba(27,118,187,0.045)"
            : "transparent",

        transition:
          "background-color 150ms ease",

        "&:hover": {
          backgroundColor:
            "rgba(23,59,115,0.05)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1.2,
        }}
      >
        <Box
          sx={{
            width: 14,
            pt: 0.6,
          }}
        >
          {unread && (
            <Circle
              sx={{
                fontSize: 8,
                color:
                  "secondary.main",
              }}
            />
          )}
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontWeight:
                unread
                  ? 700
                  : 600,

              fontSize:
                "0.82rem",

              overflow:
                "hidden",

              textOverflow:
                "ellipsis",

              whiteSpace:
                "nowrap",
            }}
          >
            {notification.title}
          </Typography>

          <Typography
            sx={{
              mt: 0.4,

              color:
                "text.secondary",

              fontSize:
                "0.75rem",

              lineHeight: 1.5,

              display:
                "-webkit-box",

              WebkitLineClamp: 2,

              WebkitBoxOrient:
                "vertical",

              overflow:
                "hidden",
            }}
          >
            {notification.message}
          </Typography>

          <Typography
            sx={{
              mt: 0.7,

              color:
                "text.disabled",

              fontSize:
                "0.68rem",
            }}
          >
            {formatDateTime(
              notification.createdOn
            )}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}