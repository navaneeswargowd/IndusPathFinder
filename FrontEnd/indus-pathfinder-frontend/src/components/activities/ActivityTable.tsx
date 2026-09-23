import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  DeleteOutlineRounded,
  EditOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

import type {
  ActivitySearchResponse,
} from "../../types/activity.types";

interface ActivityTableProps {
  activities:
    ActivitySearchResponse[];

  page:
    number;

  size:
    number;

  totalElements:
    number;

  onPageChange:
    (
      page:
        number
    ) => void;

  onSizeChange:
    (
      size:
        number
    ) => void;

  onView:
    (
      activity:
        ActivitySearchResponse
    ) => void;

  onEdit:
    (
      activity:
        ActivitySearchResponse
    ) => void;

  onDelete:
    (
      activity:
        ActivitySearchResponse
    ) => void;
}

export default function ActivityTable({
  activities,
  page,
  size,
  totalElements,
  onPageChange,
  onSizeChange,
  onView,
  onEdit,
  onDelete,
}: ActivityTableProps) {
  return (
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
      <TableContainer>
        <Table
          sx={{
            minWidth:
              1050,
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                backgroundColor:
                  "#F8FAFC",
              }}
            >
              <TableCell
                sx={
                  headerSx
                }
              >
                Code
              </TableCell>

              <TableCell
                sx={
                  headerSx
                }
              >
                Activity
              </TableCell>

              <TableCell
                sx={
                  headerSx
                }
              >
                Duration
              </TableCell>

              <TableCell
                sx={
                  headerSx
                }
              >
                Start
              </TableCell>

              <TableCell
                sx={
                  headerSx
                }
              >
                End
              </TableCell>

              <TableCell
                sx={
                  headerSx
                }
              >
                Priority
              </TableCell>

              <TableCell
                sx={
                  headerSx
                }
              >
                Status
              </TableCell>

              <TableCell
                align="right"
                sx={
                  headerSx
                }
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {activities.map(
              (
                activity
              ) => (
                <TableRow
                  hover
                  key={
                    activity.actId
                  }
                >
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize:
                          "0.76rem",

                        fontWeight:
                          700,

                        color:
                          "primary.main",

                        fontFamily:
                          "monospace",
                      }}
                    >
                      {
                        activity.actCode
                      }
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        maxWidth:
                          340,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight:
                            700,

                          fontSize:
                            "0.82rem",
                        }}
                      >
                        {
                          activity.actName
                        }
                      </Typography>

                      {activity.description && (
                        <Typography
                          sx={{
                            mt:
                              0.25,

                            color:
                              "text.secondary",

                            fontSize:
                              "0.69rem",

                            overflow:
                              "hidden",

                            whiteSpace:
                              "nowrap",

                            textOverflow:
                              "ellipsis",
                          }}
                        >
                          {
                            activity.description
                          }
                        </Typography>
                      )}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography
                      sx={{
                        fontSize:
                          "0.78rem",

                        fontWeight:
                          600,
                      }}
                    >
                      {
                        activity.duration
                      }
                      d
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={
                      cellSx
                    }
                  >
                    {
                      activity.startDate
                    }
                  </TableCell>

                  <TableCell
                    sx={
                      cellSx
                    }
                  >
                    {
                      activity.endDate
                    }
                  </TableCell>

                  <TableCell>
                    <PriorityChip
                      value={
                        activity.priority
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <StatusChip
                      value={
                        activity.status
                      }
                    />
                  </TableCell>

                  <TableCell
                    align="right"
                  >
                    <Box
                      sx={{
                        display:
                          "flex",

                        justifyContent:
                          "flex-end",

                        gap:
                          0.3,
                      }}
                    >
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() =>
                            onView(
                              activity
                            )
                          }
                        >
                          <VisibilityOutlined
                            sx={{
                              fontSize:
                                18,
                            }}
                          />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() =>
                            onEdit(
                              activity
                            )
                          }
                        >
                          <EditOutlined
                            sx={{
                              fontSize:
                                18,
                            }}
                          />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            onDelete(
                              activity
                            )
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
                  </TableCell>
                </TableRow>
              )
            )}

            {activities.length ===
              0 && (
              <TableRow>
                <TableCell
                  colSpan={
                    8
                  }
                >
                  <Box
                    sx={{
                      py:
                        7,

                      textAlign:
                        "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight:
                          700,

                        fontSize:
                          "0.84rem",
                      }}
                    >
                      No activities found
                    </Typography>

                    <Typography
                      sx={{
                        mt:
                          0.4,

                        color:
                          "text.secondary",

                        fontSize:
                          "0.72rem",
                      }}
                    >
                      Add the first activity
                      or change your search
                      filters.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
          onPageChange(
            newPage
          )
        }
        onRowsPerPageChange={(
          event
        ) =>
          onSizeChange(
            Number(
              event.target.value
            )
          )
        }
      />
    </Paper>
  );
}

const headerSx = {
  py:
    1.5,

  fontWeight:
    700,

  fontSize:
    "0.72rem",

  color:
    "text.secondary",

  whiteSpace:
    "nowrap",
};

const cellSx = {
  fontSize:
    "0.76rem",
};

function PriorityChip({
  value,
}: {
  value:
    string;
}) {
  const label =
    formatLabel(
      value
    );

  const sx =
    value === "HIGH"
      ? {
          color:
            "#B42318",

          backgroundColor:
            "#FFF1F0",

          border:
            "1px solid #FECDCA",
        }
      : value ===
          "MEDIUM"
        ? {
            color:
              "#475467",

            backgroundColor:
              "#F2F4F7",

            border:
              "1px solid #D0D5DD",
          }
        : {
            color:
              "#175CD3",

            backgroundColor:
              "#EFF8FF",

            border:
              "1px solid #B2DDFF",
          };

  return (
    <Chip
      label={
        label
      }
      size="small"
      sx={{
        height:
          24,

        fontSize:
          "0.65rem",

        fontWeight:
          650,

        ...sx,
      }}
    />
  );
}

function StatusChip({
  value,
}: {
  value:
    string;
}) {
  const sx =
    value ===
    "COMPLETED"
      ? {
          color:
            "#067647",

          backgroundColor:
            "#ECFDF3",

          border:
            "1px solid #ABEFC6",
        }
      : value ===
          "IN_PROGRESS"
        ? {
            color:
              "#B54708",

            backgroundColor:
              "#FFFAEB",

            border:
              "1px solid #FEDF89",
          }
        : {
            color:
              "#475467",

            backgroundColor:
              "#F2F4F7",

            border:
              "1px solid #D0D5DD",
          };

  return (
    <Chip
      label={
        formatLabel(
          value
        )
      }
      size="small"
      sx={{
        height:
          24,

        fontSize:
          "0.65rem",

        fontWeight:
          650,

        ...sx,
      }}
    />
  );
}

function formatLabel(
  value:
    string
) {
  return value
    .toLowerCase()
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      (
        letter
      ) =>
        letter.toUpperCase()
    );
}