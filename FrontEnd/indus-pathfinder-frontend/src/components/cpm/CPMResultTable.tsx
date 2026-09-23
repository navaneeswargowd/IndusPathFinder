import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  CPMResult,
} from "../../types/cpm.types";

interface CPMResultTableProps {
  results:
    CPMResult[];
}

export default function CPMResultTable({
  results,
}: CPMResultTableProps) {
  const [
    page,
    setPage,
  ] =
    useState(
      0
    );

  const [
    rowsPerPage,
    setRowsPerPage,
  ] =
    useState(
      5
    );

  /*
   * If analysis is re-run and result count becomes
   * smaller, reset pagination safely.
   */
  useEffect(
    () => {
      const maxPage =
        Math.max(
          0,
          Math.ceil(
            results.length /
              rowsPerPage
          ) - 1
        );

      if (
        page >
        maxPage
      ) {
        setPage(
          maxPage
        );
      }
    },
    [
      results.length,
      rowsPerPage,
      page,
    ]
  );

  /*
   * Only paginate the displayed rows.
   *
   * The complete CPM result still remains available
   * for project duration / critical path calculations.
   */
  const paginatedResults =
    useMemo(
      () => {
        const start =
          page *
          rowsPerPage;

        const end =
          start +
          rowsPerPage;

        return results.slice(
          start,
          end
        );
      },
      [
        results,
        page,
        rowsPerPage,
      ]
    );

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
              920,
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
                align="center"
                sx={
                  headerSx
                }
              >
                ES
              </TableCell>

              <TableCell
                align="center"
                sx={
                  headerSx
                }
              >
                EF
              </TableCell>

              <TableCell
                align="center"
                sx={
                  headerSx
                }
              >
                LS
              </TableCell>

              <TableCell
                align="center"
                sx={
                  headerSx
                }
              >
                LF
              </TableCell>

              <TableCell
                align="center"
                sx={
                  headerSx
                }
              >
                Critical
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedResults.map(
              (
                result
              ) => (
                <TableRow
                  hover
                  key={
                    result.activityId
                  }
                  sx={{
                    backgroundColor:
                      result.critical
                        ? "rgba(217,45,32,0.025)"
                        : "#FFFFFF",
                  }}
                >
                  <TableCell>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight:
                            700,

                          fontSize:
                            "0.81rem",
                        }}
                      >
                        {
                          result.activityName
                        }
                      </Typography>

                      <Typography
                        sx={{
                          mt:
                            0.25,

                          color:
                            "primary.main",

                          fontSize:
                            "0.68rem",

                          fontWeight:
                            700,

                          fontFamily:
                            "monospace",
                        }}
                      >
                        {
                          result.activityCode
                        }
                      </Typography>
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
                        result.duration
                      }{" "}
                      days
                    </Typography>
                  </TableCell>

                  <NumberCell
                    value={
                      result.earlyStart
                    }
                  />

                  <NumberCell
                    value={
                      result.earlyFinish
                    }
                  />

                  <NumberCell
                    value={
                      result.lateStart
                    }
                  />

                  <NumberCell
                    value={
                      result.lateFinish
                    }
                  />

                  <TableCell
                    align="center"
                  >
                    <Chip
                      label={
                        result.critical
                          ? "Critical"
                          : "Non-Critical"
                      }
                      size="small"
                      sx={{
                        height:
                          24,

                        fontSize:
                          "0.66rem",

                        fontWeight:
                          700,

                        color:
                          result.critical
                            ? "#B42318"
                            : "#067647",

                        backgroundColor:
                          result.critical
                            ? "#FFF1F0"
                            : "#ECFDF3",

                        border:
                          result.critical
                            ? "1px solid #FECDCA"
                            : "1px solid #ABEFC6",
                      }}
                    />
                  </TableCell>
                </TableRow>
              )
            )}

            {results.length ===
              0 && (
              <TableRow>
                <TableCell
                  colSpan={
                    7
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
                      No CPM results
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
                      Run CPM analysis to
                      calculate project
                      scheduling values.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {results.length >
        0 && (
        <TablePagination
          component="div"
          count={
            results.length
          }
          page={
            page
          }
          rowsPerPage={
            rowsPerPage
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
          ) => {
            setPage(
              newPage
            );
          }}
          onRowsPerPageChange={(
            event
          ) => {
            setRowsPerPage(
              Number(
                event.target.value
              )
            );

            setPage(
              0
            );
          }}
        />
      )}
    </Paper>
  );
}

const headerSx = {
  py:
    1.5,

  fontSize:
    "0.7rem",

  fontWeight:
    750,

  color:
    "text.secondary",

  whiteSpace:
    "nowrap",
};

function NumberCell({
  value,
}: {
  value:
    number;
}) {
  return (
    <TableCell
      align="center"
    >
      <Box
        sx={{
          minWidth:
            38,

          display:
            "inline-flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          px:
            1,

          py:
            0.5,

          borderRadius:
            1.5,

          backgroundColor:
            "#F2F4F7",

          color:
            "#344054",

          fontSize:
            "0.74rem",

          fontWeight:
            700,
        }}
      >
        {value}
      </Box>
    </TableCell>
  );
}