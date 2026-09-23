import {
  AssessmentOutlined,
  CloseRounded,
  DownloadRounded,
  RefreshRounded,
  SearchRounded,
  VisibilityOutlined,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
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
} from "@tanstack/react-query";

import {
  useSnackbar,
} from "notistack";

import {
  exportAuditLogsApi,
  getAuditLogDetailsApi,
  searchAuditLogsApi,
} from "../../../api/audit-log.api";

import type {
  AuditLogResponse,
  ExportFormat,
} from "../../../types/audit-log.types";

import {
  getErrorMessage,
} from "../../../utils/error.utils";

export default function AuditLogsPage() {
  const {
    enqueueSnackbar,
  } =
    useSnackbar();

  const [
    username,
    setUsername,
  ] =
    useState("");

  const [
    actionName,
    setActionName,
  ] =
    useState("");

  const [
    actionScreen,
    setActionScreen,
  ] =
    useState("");

  const [
    userId,
    setUserId,
  ] =
    useState("");

  const [
    fromDate,
    setFromDate,
  ] =
    useState("");

  const [
    toDate,
    setToDate,
  ] =
    useState("");

  const [
    page,
    setPage,
  ] =
    useState(0);

  const [
    size,
    setSize,
  ] =
    useState(10);

  const [
    sortBy,
    setSortBy,
  ] =
    useState(
      "actionDate"
    );

  const [
    direction,
    setDirection,
  ] =
    useState<
      "asc" | "desc"
    >("desc");

  const [
    detailsOpen,
    setDetailsOpen,
  ] =
    useState(false);

  const [
    selectedAuditId,
    setSelectedAuditId,
  ] =
    useState<
      number | null
    >(null);

  /*
   * ========================================================
   * SEARCH
   * ========================================================
   */

  const auditLogsQuery =
    useQuery({
      queryKey: [
        "audit-logs",
        username,
        actionName,
        actionScreen,
        userId,
        fromDate,
        toDate,
        page,
        size,
        sortBy,
        direction,
      ],

      queryFn:
        () =>
          searchAuditLogsApi({
            userId:
              userId
                ? Number(
                    userId
                  )
                : undefined,

            username:
              username.trim() ||
              undefined,

            actionName:
              actionName.trim() ||
              undefined,

            actionScreen:
              actionScreen.trim() ||
              undefined,

            fromDate:
              toStartDateTime(
                fromDate
              ),

            toDate:
              toEndDateTime(
                toDate
              ),

            page,

            size,

            sortBy,

            direction,
          }),

      staleTime:
        15_000,
    });

  /*
   * ========================================================
   * DETAILS
   * ========================================================
   */

  const auditDetailsQuery =
    useQuery({
      queryKey: [
        "audit-log-details",
        selectedAuditId,
      ],

      queryFn:
        () =>
          getAuditLogDetailsApi({
            auditId:
              selectedAuditId!,
          }),

      enabled:
        selectedAuditId !==
          null &&
        detailsOpen,
    });

  /*
   * ========================================================
   * EXPORT
   * ========================================================
   */

  const exportMutation =
    useMutation({
      mutationFn:
        (
          exportFormat:
            ExportFormat
        ) =>
          exportAuditLogsApi({
            userId:
              userId
                ? Number(
                    userId
                  )
                : undefined,

            username:
              username.trim() ||
              undefined,

            actionName:
              actionName.trim() ||
              undefined,

            actionScreen:
              actionScreen.trim() ||
              undefined,

            fromDate:
              toStartDateTime(
                fromDate
              ),

            toDate:
              toEndDateTime(
                toDate
              ),

            exportFormat,
          }),

      onSuccess:
        () => {
          enqueueSnackbar(
            "Audit log report downloaded successfully.",
            {
              variant:
                "success",
            }
          );
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
   * ========================================================
   * SORT
   * ========================================================
   */

  const handleSort =
    (
      field:
        string
    ) => {
      if (
        sortBy ===
        field
      ) {
        setDirection(
          previous =>
            previous ===
            "asc"
              ? "desc"
              : "asc"
        );

        return;
      }

      setSortBy(
        field
      );

      setDirection(
        "asc"
      );

      setPage(
        0
      );
    };

  /*
   * ========================================================
   * CLEAR FILTERS
   * ========================================================
   */

  const clearFilters =
    () => {
      setUsername(
        ""
      );

      setActionName(
        ""
      );

      setActionScreen(
        ""
      );

      setUserId(
        ""
      );

      setFromDate(
        ""
      );

      setToDate(
        ""
      );

      setPage(
        0
      );
    };

  /*
   * ========================================================
   * VIEW DETAILS
   * ========================================================
   */

  const openDetails =
    (
      audit:
        AuditLogResponse
    ) => {
      setSelectedAuditId(
        audit.auditId
      );

      setDetailsOpen(
        true
      );
    };

  const closeDetails =
    () => {
      setDetailsOpen(
        false
      );

      setSelectedAuditId(
        null
      );
    };

  const logs =
    auditLogsQuery.data
      ?.content ??
    [];

  const totalElements =
    auditLogsQuery.data
      ?.totalElements ??
    0;

  return (
    <Box>
      {/* ================================================== */}
      {/* PAGE HEADER */}
      {/* ================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs:
              2,

            md:
              2.5,
          },

          mb:
            2,

          display:
            "flex",

          alignItems: {
            xs:
              "flex-start",

            md:
              "center",
          },

          justifyContent:
            "space-between",

          flexDirection: {
            xs:
              "column",

            md:
              "row",
          },

          gap:
            2,

          border:
            "1px solid",

          borderColor:
            "divider",

          borderRadius:
            3,

          background:
            "linear-gradient(135deg, #F8FAFC 0%, #EDF7F8 100%)",
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
                2.3,

              color:
                "#078E91",

              backgroundColor:
                "#E4F5F5",
            }}
          >
            <AssessmentOutlined />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize:
                  "1.08rem",

                fontWeight:
                  760,
              }}
            >
              Audit Logs
            </Typography>

            <Typography
              sx={{
                mt:
                  0.25,

                color:
                  "text.secondary",

                fontSize:
                  "0.73rem",
              }}
            >
              Review user actions and
              platform activity across
              IndusPathFinder.
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          startIcon={
            <RefreshRounded />
          }
          disabled={
            auditLogsQuery
              .isFetching
          }
          onClick={() =>
            auditLogsQuery.refetch()
          }
        >
          Refresh
        </Button>
      </Paper>

      {/* ================================================== */}
      {/* FILTERS */}
      {/* ================================================== */}

      <Paper
        elevation={0}
        sx={{
          p:
            2,

          mb:
            1.5,

          border:
            "1px solid",

          borderColor:
            "divider",

          borderRadius:
            2.5,
        }}
      >
        <Box
          sx={{
            display:
              "grid",

            gridTemplateColumns: {
              xs:
                "1fr",

              sm:
                "repeat(2, minmax(0, 1fr))",

              xl:
                "repeat(4, minmax(0, 1fr))",
            },

            gap:
              1.4,
          }}
        >
          <TextField
            size="small"
            label="Username"
            value={
              username
            }
            onChange={(
              event
            ) => {
              setUsername(
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
                            18,
                        }}
                      />
                    </InputAdornment>
                  ),
              },
            }}
          />

          <TextField
            size="small"
            label="Action Name"
            placeholder="CREATE_PROJECT"
            value={
              actionName
            }
            onChange={(
              event
            ) => {
              setActionName(
                event.target.value
              );

              setPage(
                0
              );
            }}
          />

          {/* <TextField
            size="small"
            label="Action Screen"
            placeholder="PROJECTS"
            value={
              actionScreen
            }
            onChange={(
              event
            ) => {
              setActionScreen(
                event.target.value
              );

              setPage(
                0
              );
            }}
          /> */}

          {/* <TextField
            size="small"
            label="User ID"
            type="number"
            value={
              userId
            }
            onChange={(
              event
            ) => {
              setUserId(
                event.target.value
              );

              setPage(
                0
              );
            }}
          /> */}

          <TextField
            size="small"
            label="From Date"
            type="date"
            value={
              fromDate
            }
            onChange={(
              event
            ) => {
              setFromDate(
                event.target.value
              );

              setPage(
                0
              );
            }}
            slotProps={{
              inputLabel: {
                shrink:
                  true,
              },
            }}
          />

          <TextField
            size="small"
            label="To Date"
            type="date"
            value={
              toDate
            }
            onChange={(
              event
            ) => {
              setToDate(
                event.target.value
              );

              setPage(
                0
              );
            }}
            slotProps={{
              inputLabel: {
                shrink:
                  true,
              },
            }}
          />

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
            <Button
              variant="outlined"
              onClick={
                clearFilters
              }
              fullWidth
            >
              Clear Filters
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* ================================================== */}
      {/* EXPORT BAR */}
      {/* ================================================== */}

      <Paper
        elevation={0}
        sx={{
          px:
            2,

          py:
            1.25,

          mb:
            1.5,

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          flexWrap:
            "wrap",

          gap:
            1.5,

          border:
            "1px solid",

          borderColor:
            "divider",

          borderRadius:
            2.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight:
                700,

              fontSize:
                "0.78rem",
            }}
          >
            Export Audit Logs
          </Typography>

          <Typography
            sx={{
              mt:
                0.2,

              color:
                "text.secondary",

              fontSize:
                "0.65rem",
            }}
          >
            Current filters are applied
            to exported records.
          </Typography>
        </Box>

        <Box
          sx={{
            display:
              "flex",

            gap:
              0.8,

            flexWrap:
              "wrap",
          }}
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={
              <DownloadRounded />
            }
            disabled={
              exportMutation
                .isPending
            }
            onClick={() =>
              exportMutation.mutate(
                "PDF"
              )
            }
          >
            PDF
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={
              <DownloadRounded />
            }
            disabled={
              exportMutation
                .isPending
            }
            onClick={() =>
              exportMutation.mutate(
                "EXCEL"
              )
            }
          >
            Excel
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={
              <DownloadRounded />
            }
            disabled={
              exportMutation
                .isPending
            }
            onClick={() =>
              exportMutation.mutate(
                "CSV"
              )
            }
          >
            CSV
          </Button>
        </Box>
      </Paper>

      {/* ================================================== */}
      {/* LOADING */}
      {/* ================================================== */}

      {auditLogsQuery.isLoading && (
        <Paper
          elevation={0}
          sx={{
            minHeight:
              280,

            display:
              "flex",

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
        </Paper>
      )}

      {/* ================================================== */}
      {/* ERROR */}
      {/* ================================================== */}

      {auditLogsQuery.isError && (
        <Paper
          elevation={0}
          sx={{
            py:
              6,

            textAlign:
              "center",

            border:
              "1px solid",

            borderColor:
              "divider",

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
            Unable to load audit logs.
          </Typography>

          <Button
            sx={{
              mt:
                1,
            }}
            onClick={() =>
              auditLogsQuery.refetch()
            }
          >
            Try Again
          </Button>
        </Paper>
      )}

      {/* ================================================== */}
      {/* TABLE */}
      {/* ================================================== */}

      {!auditLogsQuery.isLoading &&
        !auditLogsQuery.isError && (
        <Paper
          elevation={0}
          sx={{
            overflow:
              "hidden",

            border:
              "1px solid",

            borderColor:
              "divider",

            borderRadius:
              2.5,
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <SortableHeader
                    label="Audit ID"
                    field="auditId"
                    sortBy={
                      sortBy
                    }
                    direction={
                      direction
                    }
                    onSort={
                      handleSort
                    }
                  />

                  <TableCell>
                    Username
                  </TableCell>

                  <TableCell>
                    Action
                  </TableCell>

                  <TableCell>
                    Screen
                  </TableCell>

                  <TableCell>
                    Screen ID
                  </TableCell>

                  <SortableHeader
                    label="Action Date"
                    field="actionDate"
                    sortBy={
                      sortBy
                    }
                    direction={
                      direction
                    }
                    onSort={
                      handleSort
                    }
                  />

                  <TableCell
                    align="right"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {logs.map(
                  (
                    log
                  ) => (
                    <TableRow
                      hover
                      key={
                        log.auditId
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
                          }}
                        >
                          #{log.auditId}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Box>
                          <Typography
                            sx={{
                              fontWeight:
                                700,

                              fontSize:
                                "0.76rem",
                            }}
                          >
                            {
                              log.username
                            }
                          </Typography>

                          {log.userId && (
                            <Typography
                              sx={{
                                color:
                                  "text.secondary",

                                fontSize:
                                  "0.61rem",
                              }}
                            >
                              User ID:{" "}
                              {
                                log.userId
                              }
                            </Typography>
                          )}
                        </Box>
                      </TableCell>

                      <TableCell>
                        <ActionChip
                          action={
                            log.actionName
                          }
                        />
                      </TableCell>

                      <TableCell>
                        <Typography
                          sx={{
                            fontSize:
                              "0.72rem",

                            fontWeight:
                              650,
                          }}
                        >
                          {formatLabel(
                            log.actionScreen
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {log.actionScreenId ??
                          "-"}
                      </TableCell>

                      <TableCell>
                        <Typography
                          sx={{
                            fontSize:
                              "0.7rem",

                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {formatDateTime(
                            log.actionDate
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell
                        align="right"
                      >
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() =>
                              openDetails(
                                log
                              )
                            }
                          >
                            <VisibilityOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                )}

                {logs.length ===
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
                        <AssessmentOutlined
                          sx={{
                            mb:
                              1,

                            fontSize:
                              35,

                            color:
                              "text.disabled",
                          }}
                        />

                        <Typography
                          sx={{
                            fontWeight:
                              700,

                            fontSize:
                              "0.82rem",
                          }}
                        >
                          No audit logs found
                        </Typography>

                        <Typography
                          sx={{
                            mt:
                              0.3,

                            color:
                              "text.secondary",

                            fontSize:
                              "0.68rem",
                          }}
                        >
                          Try changing your
                          search filters.
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

      {/* ================================================== */}
      {/* DETAILS DIALOG */}
      {/* ================================================== */}

      <Dialog
        open={
          detailsOpen
        }
        onClose={
          closeDetails
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",
          }}
        >
          Audit Log Details

          <IconButton
            size="small"
            onClick={
              closeDetails
            }
          >
            <CloseRounded />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {auditDetailsQuery
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
                  30
                }
              />
            </Box>
          )}

          {auditDetailsQuery
            .isError && (
            <Typography
              color="error"
              sx={{
                py:
                  3,

                textAlign:
                  "center",
              }}
            >
              Unable to load audit
              log details.
            </Typography>
          )}

          {auditDetailsQuery
            .data && (
            <AuditDetails
              audit={
                auditDetailsQuery
                  .data
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

/*
 * ==========================================================
 * DETAILS
 * ==========================================================
 */

function AuditDetails({
  audit,
}: {
  audit:
    AuditLogResponse;
}) {
  return (
    <Box>
      <DetailRow
        label="Audit ID"
        value={
          audit.auditId
        }
      />

      <DetailRow
        label="User ID"
        value={
          audit.userId ??
          "-"
        }
      />

      <DetailRow
        label="Username"
        value={
          audit.username
        }
      />

      <DetailRow
        label="Action"
        value={
          formatLabel(
            audit.actionName
          )
        }
      />

      <DetailRow
        label="Screen"
        value={
          formatLabel(
            audit.actionScreen
          )
        }
      />

      <DetailRow
        label="Screen ID"
        value={
          audit.actionScreenId ??
          "-"
        }
      />

      <DetailRow
        label="Action Date"
        value={
          formatDateTime(
            audit.actionDate
          )
        }
      />

      <Divider
        sx={{
          my:
            2,
        }}
      />

      <Typography
        sx={{
          mb:
            0.7,

          color:
            "text.secondary",

          fontSize:
            "0.68rem",

          fontWeight:
            700,

          textTransform:
            "uppercase",
        }}
      >
        Details
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p:
            1.5,

          border:
            "1px solid",

          borderColor:
            "divider",

          borderRadius:
            2,

          backgroundColor:
            "#F8FAFC",
        }}
      >
        <Typography
          sx={{
            fontSize:
              "0.75rem",

            lineHeight:
              1.7,

            whiteSpace:
              "pre-wrap",
          }}
        >
          {audit.details ||
            "No additional details available."}
        </Typography>
      </Paper>
    </Box>
  );
}

function DetailRow({
  label,
  value,
}: {
  label:
    string;

  value:
    string | number;
}) {
  return (
    <Box
      sx={{
        py:
          1,

        display:
          "grid",

        gridTemplateColumns:
          "130px minmax(0, 1fr)",

        gap:
          2,

        borderBottom:
          "1px solid",

        borderColor:
          "divider",
      }}
    >
      <Typography
        sx={{
          color:
            "text.secondary",

          fontSize:
            "0.69rem",

          fontWeight:
            650,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize:
            "0.74rem",

          fontWeight:
            650,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

/*
 * ==========================================================
 * SORTABLE HEADER
 * ==========================================================
 */

interface SortableHeaderProps {
  label:
    string;

  field:
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
  label,
  field,
  sortBy,
  direction,
  onSort,
}: SortableHeaderProps) {
  return (
    <TableCell>
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

/*
 * ==========================================================
 * ACTION CHIP
 * ==========================================================
 */

function ActionChip({
  action,
}: {
  action:
    string;
}) {
  return (
    <Chip
      size="small"
      label={
        formatLabel(
          action
        )
      }
      sx={{
        height:
          23,

        maxWidth:
          180,

        fontSize:
          "0.61rem",

        fontWeight:
          700,

        color:
          "#175CD3",

        backgroundColor:
          "#EFF8FF",
      }}
    />
  );
}

/*
 * ==========================================================
 * HELPERS
 * ==========================================================
 */

function formatLabel(
  value:
    string
): string {
  return value
    .replaceAll(
      "_",
      " "
    )
    .toLowerCase()
    .replace(
      /\b\w/g,
      char =>
        char.toUpperCase()
    );
}

function formatDateTime(
  value:
    string
): string {
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

/*
 * Backend expects LocalDateTime.
 *
 * Example:
 * 2026-08-10T00:00:00
 */
function toStartDateTime(
  value:
    string
): string | undefined {
  if (
    !value
  ) {
    return undefined;
  }

  return `${value}T00:00:00`;
}

function toEndDateTime(
  value:
    string
): string | undefined {
  if (
    !value
  ) {
    return undefined;
  }

  return `${value}T23:59:59`;
}