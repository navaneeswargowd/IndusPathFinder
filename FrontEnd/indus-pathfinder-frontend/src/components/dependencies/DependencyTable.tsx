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
    ArrowForwardRounded,
  DeleteOutlineRounded,
  EditOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

import type {
  DependencySearchResponse,
} from "../../types/dependency.types";

interface DependencyTableProps {
  dependencies:
    DependencySearchResponse[];

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
      dependency:
        DependencySearchResponse
    ) => void;

  onEdit:
    (
      dependency:
        DependencySearchResponse
    ) => void;

  onDelete:
    (
      dependency:
        DependencySearchResponse
    ) => void;
}

export default function DependencyTable({
  dependencies,
  page,
  size,
  totalElements,
  onPageChange,
  onSizeChange,
  onView,
  onEdit,
  onDelete,
}: DependencyTableProps) {
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
              850,
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
                Predecessor
              </TableCell>

              <TableCell
                align="center"
                sx={
                  headerSx
                }
              >
                Relation
              </TableCell>

              <TableCell
                sx={
                  headerSx
                }
              >
                Successor
              </TableCell>

              <TableCell
                sx={
                  headerSx
                }
              >
                Type
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
            {dependencies.map(
              (
                dependency
              ) => (
                <TableRow
                  hover
                  key={
                    dependency.dependencyId
                  }
                >
                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight:
                          700,

                        fontSize:
                          "0.8rem",
                      }}
                    >
                      {
                        dependency
                          .predecessorActivityName
                      }
                    </Typography>
                  </TableCell>

                  <TableCell
                    align="center"
                  >
                    <Box
                      sx={{
                        display:
                          "inline-flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        width:
                          34,

                        height:
                          34,

                        borderRadius:
                          "50%",

                        color:
                          "#078E91",

                        backgroundColor:
                          "#EAF8F8",
                      }}
                    >
                      <ArrowForwardRounded
                        sx={{
                          fontSize:
                            18,
                        }}
                      />
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight:
                          700,

                        fontSize:
                          "0.8rem",
                      }}
                    >
                      {
                        dependency
                          .successorActivityName
                      }
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <DependencyTypeChip
                      value={
                        dependency
                          .dependencyType
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
                              dependency
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
                              dependency
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
                              dependency
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

            {dependencies.length ===
              0 && (
              <TableRow>
                <TableCell
                  colSpan={
                    5
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
                          "0.85rem",
                      }}
                    >
                      No dependencies found
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
                      Create relationships
                      between project
                      activities.
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
};

function DependencyTypeChip({
  value,
}: {
  value:
    string;
}) {
  let label =
    value;

  if (
    value === "FS"
  ) {
    label =
      "FS";
  }

  if (
    value === "SS"
  ) {
    label =
      "SS";
  }

  if (
    value === "FF"
  ) {
    label =
      "FF";
  }

  if (
    value === "SF"
  ) {
    label =
      "SF";
  }

  return (
    <Tooltip
      title={
        getDependencyTypeDescription(
          value
        )
      }
    >
      <Chip
        label={
          label
        }
        size="small"
        sx={{
          minWidth:
            45,

          height:
            25,

          fontSize:
            "0.68rem",

          fontWeight:
            750,

          color:
            "#075985",

          backgroundColor:
            "#F0F9FF",

          border:
            "1px solid #BAE6FD",
        }}
      />
    </Tooltip>
  );
}

function getDependencyTypeDescription(
  value:
    string
) {
  switch (
    value
  ) {
    case "FS":
      return "Finish to Start";

    case "SS":
      return "Start to Start";

    case "FF":
      return "Finish to Finish";

    case "SF":
      return "Start to Finish";

    default:
      return value;
  }
}