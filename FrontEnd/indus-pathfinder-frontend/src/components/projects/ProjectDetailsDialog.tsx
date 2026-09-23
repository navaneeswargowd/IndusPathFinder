import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  getProjectDetailsApi,
} from "../../api/project.api";

import StatusBadge from "../display/StatusBadge";

interface ProjectDetailsDialogProps {
  projectId:
    number | null;

  open: boolean;

  onClose:
    () => void;
}

export default function ProjectDetailsDialog({
  projectId,
  open,
  onClose,
}: ProjectDetailsDialogProps) {
  const query =
    useQuery({
      queryKey: [
        "project-details",
        projectId,
      ],

      queryFn: () =>
        getProjectDetailsApi({
          projectId:
            projectId!,
        }),

      enabled:
        open &&
        projectId !== null,
    });

  const project =
    query.data;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Project Details
      </DialogTitle>

      <Divider />

      <DialogContent>
        {query.isLoading && (
          <Box
            sx={{
              py: 6,

              display:
                "flex",

              justifyContent:
                "center",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {query.isError && (
          <Typography
            color="error"
          >
            Unable to load project
            details.
          </Typography>
        )}

        {project && (
          <Box
            sx={{
              display:
                "grid",

              gridTemplateColumns: {
                xs:
                  "1fr",

                sm:
                  "1fr 1fr",
              },

              gap: 2.2,
            }}
          >
            <DetailItem
              label="Project Code"
              value={
                project.projectCode
              }
            />

            <DetailItem
              label="Project Name"
              value={
                project.projectName
              }
            />

            <DetailItem
              label="Start Date"
              value={
                project.startDate
              }
            />

            <DetailItem
              label="End Date"
              value={
                project.endDate
              }
            />

            <DetailItem
              label="Priority"
              value={
                project.priority
              }
            />

            <Box>
              <Typography
                sx={{
                  color:
                    "text.secondary",

                  fontSize:
                    "0.7rem",
                }}
              >
                Status
              </Typography>

              <Box
                sx={{
                  mt: 0.6,
                }}
              >
                <StatusBadge
                  status={
                    project.status
                  }
                />
              </Box>
            </Box>

            <Box
              sx={{
                gridColumn: {
                  sm:
                    "1 / -1",
                },
              }}
            >
              <DetailItem
                label="Description"
                value={
                  project.description ||
                  "-"
                }
              />
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value:
    string | number;
}) {
  return (
    <Box>
      <Typography
        sx={{
          color:
            "text.secondary",

          fontSize:
            "0.7rem",
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          mt: 0.45,

          fontWeight:
            650,

          fontSize:
            "0.84rem",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}