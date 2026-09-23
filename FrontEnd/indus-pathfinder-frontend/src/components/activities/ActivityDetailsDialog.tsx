import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  getActivityDetailsApi,
} from "../../api/activity.api";

interface ActivityDetailsDialogProps {
  actId:
    number | null;

  open:
    boolean;

  onClose:
    () => void;
}

export default function ActivityDetailsDialog({
  actId,
  open,
  onClose,
}: ActivityDetailsDialogProps) {
  const query =
    useQuery({
      queryKey: [
        "activity-details",
        actId,
      ],

      queryFn:
        () =>
          getActivityDetailsApi({
            actId:
              actId!,
          }),

      enabled:
        open &&
        actId !==
          null,
    });

  const activity =
    query.data;

  return (
    <Dialog
      open={
        open
      }
      onClose={
        onClose
      }
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Activity Details
      </DialogTitle>

      <DialogContent
        dividers
      >
        {query.isLoading && (
          <Typography>
            Loading...
          </Typography>
        )}

        {query.isError && (
          <Typography
            color="error"
          >
            Unable to load activity.
          </Typography>
        )}

        {activity && (
          <Box
            sx={{
              display:
                "grid",

              gridTemplateColumns: {
                xs:
                  "1fr",

                sm:
                  "repeat(2, 1fr)",
              },

              gap:
                2,
            }}
          >
            <Detail
              label="Activity Code"
              value={
                activity.actCode
              }
            />

            <Detail
              label="Activity Name"
              value={
                activity.actName
              }
            />

            <Detail
              label="Duration"
              value={`${activity.duration} days`}
            />

            <Detail
              label="Priority"
              value={
                activity.priority
              }
            />

            <Detail
              label="Start Date"
              value={
                activity.startDate
              }
            />

            <Detail
              label="End Date"
              value={
                activity.endDate
              }
            />

            <Detail
              label="Status"
              value={
                activity.status
              }
            />

            <Box
              sx={{
                gridColumn: {
                  sm:
                    "1 / -1",
                },
              }}
            >
              <Detail
                label="Description"
                value={
                  activity.description ||
                  "-"
                }
              />
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={
            onClose
          }
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Detail({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <Box>
      <Typography
        sx={{
          color:
            "text.secondary",

          fontSize:
            "0.68rem",
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          mt:
            0.4,

          fontSize:
            "0.82rem",

          fontWeight:
            650,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}