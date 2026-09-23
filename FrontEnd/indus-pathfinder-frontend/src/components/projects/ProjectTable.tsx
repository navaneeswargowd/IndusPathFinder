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
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  DeleteOutlineRounded,
  EditOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

import type {
  ProjectSearchResponse,
} from "../../types/project.types";

import StatusBadge from "../display/StatusBadge";

interface ProjectTableProps {
  projects:
    ProjectSearchResponse[];

  page:
    number;

  size:
    number;

  totalElements:
    number;

  sortBy:
    string;

  direction:
    "asc" | "desc";

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

  onSort:
    (
      field:
        string
    ) => void;

  onView:
    (
      project:
        ProjectSearchResponse
    ) => void;

  onEdit:
    (
      project:
        ProjectSearchResponse
    ) => void;

  onDelete:
    (
      project:
        ProjectSearchResponse
    ) => void;
}

export default function ProjectTable({
  projects,
  page,
  size,
  totalElements,
  sortBy,
  direction,
  onPageChange,
  onSizeChange,
  onSort,
  onView,
  onEdit,
  onDelete,
}: ProjectTableProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        border:
          "1px solid",

        borderColor:
          "rgba(23,59,115,0.09)",

        borderRadius:
          3.5,

        overflow:
          "hidden",

        backgroundColor:
          "#FFFFFF",

        boxShadow:
          "0 14px 42px rgba(23,59,115,0.08)",
      }}
    >
      <TableContainer
        sx={{
          overflowX:
            "auto",
        }}
      >
        <Table
          sx={{
            minWidth:
              950,
          }}
        >
          <TableHead
            sx={{
              background:
                "linear-gradient(180deg, #F4F7FB 0%, #EEF3F8 100%)",
            }}
          >
            <TableRow>
              <SortableHeader
                field="projectCode"
                label="Code"
                sortBy={
                  sortBy
                }
                direction={
                  direction
                }
                onSort={
                  onSort
                }
              />

              <SortableHeader
                field="projectName"
                label="Project"
                sortBy={
                  sortBy
                }
                direction={
                  direction
                }
                onSort={
                  onSort
                }
              />

              <TableCell
                sx={
                  headerCellSx
                }
              >
                Start Date
              </TableCell>

              <TableCell
                sx={
                  headerCellSx
                }
              >
                End Date
              </TableCell>

              <TableCell
                sx={
                  headerCellSx
                }
              >
                Priority
              </TableCell>

              <TableCell
                sx={
                  headerCellSx
                }
              >
                Status
              </TableCell>

              <TableCell
                align="right"
                sx={
                  headerCellSx
                }
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {projects.map(
              (
                project
              ) => (
                <TableRow
                  hover
                  key={
                    project.projectId
                  }
                  sx={{
                    transition:
                      "background-color 150ms ease",

                    "&:hover":
                      {
                        backgroundColor:
                          "rgba(23,59,115,0.025)",
                      },

                    "&:last-child td":
                      {
                        borderBottom:
                          0,
                      },
                  }}
                >
                  <TableCell
                    sx={
                      bodyCellSx
                    }
                  >
                    <Typography
                      sx={{
                        fontSize:
                          "0.79rem",

                        fontWeight:
                          750,

                        color:
                          "primary.main",
                      }}
                    >
                      {
                        project.projectCode
                      }
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={
                      bodyCellSx
                    }
                  >
                    <Box
                      sx={{
                        maxWidth:
                          280,
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
                        {
                          project.projectName
                        }
                      </Typography>

                      {project.description && (
                        <Typography
                          sx={{
                            mt:
                              0.35,

                            color:
                              "text.secondary",

                            fontSize:
                              "0.7rem",

                            overflow:
                              "hidden",

                            display:
                              "-webkit-box",

                            WebkitLineClamp:
                              1,

                            WebkitBoxOrient:
                              "vertical",
                          }}
                        >
                          {
                            project.description
                          }
                        </Typography>
                      )}
                    </Box>
                  </TableCell>

                  <TableCell
                    sx={
                      bodyCellSx
                    }
                  >
                    {
                      project.startDate
                    }
                  </TableCell>

                  <TableCell
                    sx={
                      bodyCellSx
                    }
                  >
                    {
                      project.endDate
                    }
                  </TableCell>

                  <TableCell
                    sx={
                      bodyCellSx
                    }
                  >
                    <PriorityBadge
                      priority={
                        project.priority
                      }
                    />
                  </TableCell>

                  <TableCell
                    sx={
                      bodyCellSx
                    }
                  >
                    <StatusBadge
                      status={
                        project.status
                      }
                    />
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={
                      bodyCellSx
                    }
                  >
                    <Box
                      sx={{
                        display:
                          "flex",

                        justifyContent:
                          "flex-end",

                        gap:
                          0.5,
                      }}
                    >
                      <Tooltip title="View Project">
                        <IconButton
                          size="small"
                          onClick={() =>
                            onView(
                              project
                            )
                          }
                          sx={{
                            width:
                              34,

                            height:
                              34,

                            border:
                              "1px solid",

                            borderColor:
                              "divider",

                            color:
                              "primary.main",

                            "&:hover":
                              {
                                backgroundColor:
                                  "rgba(23,59,115,0.07)",
                              },
                          }}
                        >
                          <VisibilityOutlined
                            sx={{
                              fontSize:
                                18,
                            }}
                          />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Edit Project">
                        <IconButton
                          size="small"
                          onClick={() =>
                            onEdit(
                              project
                            )
                          }
                          sx={{
                            width:
                              34,

                            height:
                              34,

                            border:
                              "1px solid",

                            borderColor:
                              "divider",

                            color:
                              "secondary.main",

                            "&:hover":
                              {
                                backgroundColor:
                                  "rgba(13,146,184,0.07)",
                              },
                          }}
                        >
                          <EditOutlined
                            sx={{
                              fontSize:
                                18,
                            }}
                          />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Project">
                        <IconButton
                          size="small"
                          onClick={() =>
                            onDelete(
                              project
                            )
                          }
                          sx={{
                            width:
                              34,

                            height:
                              34,

                            border:
                              "1px solid",

                            borderColor:
                              "rgba(211,47,47,0.16)",

                            color:
                              "error.main",

                            backgroundColor:
                              "rgba(211,47,47,0.025)",

                            "&:hover":
                              {
                                backgroundColor:
                                  "rgba(211,47,47,0.08)",
                              },
                          }}
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

            {projects.length ===
              0 && (
              <TableRow>
                <TableCell
                  colSpan={
                    7
                  }
                  sx={{
                    borderBottom:
                      0,
                  }}
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
                          "0.86rem",
                      }}
                    >
                      No projects found
                    </Typography>

                    <Typography
                      sx={{
                        mt:
                          0.5,

                        color:
                          "text.secondary",

                        fontSize:
                          "0.74rem",
                      }}
                    >
                      Change your filters
                      or create a new
                      project.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          borderTop:
            "1px solid",

          borderColor:
            "divider",

          backgroundColor:
            "#F8FAFC",
        }}
      >
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
          ) => {
            onSizeChange(
              Number(
                event.target.value
              )
            );
          }}
        />
      </Box>
    </Paper>
  );
}

const headerCellSx = {
  py:
    1.8,

  fontSize:
    "0.72rem",

  fontWeight:
    750,

  color:
    "text.secondary",

  textTransform:
    "uppercase",

  letterSpacing:
    "0.035em",

  whiteSpace:
    "nowrap",
};

const bodyCellSx = {
  py:
    1.8,

  borderColor:
    "divider",

  verticalAlign:
    "middle",
};

interface SortableHeaderProps {
  field:
    string;

  label:
    string;

  sortBy:
    string;

  direction:
    "asc" | "desc";

  onSort:
    (
      field:
        string
    ) => void;
}

function SortableHeader({
  field,
  label,
  sortBy,
  direction,
  onSort,
}: SortableHeaderProps) {
  return (
    <TableCell
      sx={
        headerCellSx
      }
    >
      <TableSortLabel
        active={
          sortBy ===
          field
        }
        direction={
          sortBy ===
          field
            ? direction
            : "asc"
        }
        onClick={() =>
          onSort(
            field
          )
        }
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
}

interface PriorityBadgeProps {
  priority:
    string;
}

function PriorityBadge({
  priority,
}: PriorityBadgeProps) {
  const normalized =
    priority.toUpperCase();

  if (
    normalized ===
    "HIGH"
  ) {
    return (
      <Chip
        label="High"
        size="small"
        sx={{
          height:
            25,

          fontSize:
            "0.68rem",

          fontWeight:
            700,

          color:
            "#B42318",

          backgroundColor:
            "#FFF1F0",

          border:
            "1px solid #FECDCA",
        }}
      />
    );
  }

  if (
    normalized ===
    "MEDIUM"
  ) {
    return (
      <Chip
        label="Medium"
        size="small"
        sx={{
          height:
            25,

          fontSize:
            "0.68rem",

          fontWeight:
            700,

          color:
            "#B54708",

          backgroundColor:
            "#FFFAEB",

          border:
            "1px solid #FEDF89",
        }}
      />
    );
  }

  return (
    <Chip
      label="Low"
      size="small"
      sx={{
        height:
          25,

        fontSize:
          "0.68rem",

        fontWeight:
          700,

        color:
          "#175CD3",

        backgroundColor:
          "#EFF8FF",

        border:
          "1px solid #B2DDFF",
      }}
    />
  );
}