import {
  ApartmentOutlined,
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
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
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
  useQuery,
} from "@tanstack/react-query";

import {
  searchOrganizationsApi,
} from "../../../api/organization.api";

import type {
  OrganizationResponse,
  OrganizationStatus,
} from "../../../types/organization.types";

export default function OrganizationsPage() {
  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    status,
    setStatus,
  ] =
    useState<
      "" | OrganizationStatus
    >("");

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
      "orgId"
    );

  const [
    sortDir,
    setSortDir,
  ] =
    useState<
      "asc" | "desc"
    >("asc");

  const [
    selectedOrganization,
    setSelectedOrganization,
  ] =
    useState<
      OrganizationResponse | null
    >(null);

  /*
   * ========================================================
   * QUERY
   * ========================================================
   */

  const organizationQuery =
    useQuery({
      queryKey: [
        "admin-organizations",
        search,
        status,
        page,
        size,
        sortBy,
        sortDir,
      ],

      queryFn:
        () =>
          searchOrganizationsApi({
            search:
              search.trim(),

            status,

            page,

            size,

            sortBy,

            sortDir,
          }),

      staleTime:
        20_000,
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
        setSortDir(
          previous =>
            previous ===
            "asc"
              ? "desc"
              : "asc"
        );

        setPage(
          0
        );

        return;
      }

      setSortBy(
        field
      );

      setSortDir(
        "asc"
      );

      setPage(
        0
      );
    };

  const organizations =
    organizationQuery
      .data?.content ??
    [];

  const totalElements =
    organizationQuery
      .data
      ?.totalElements ??
    0;

  return (
    <Box>
      {/* ================================================== */}
      {/* HEADER */}
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

          flexDirection: {
            xs:
              "column",

            sm:
              "row",
          },

          alignItems: {
            xs:
              "flex-start",

            sm:
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
            3,

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

              borderRadius:
                2.3,

              color:
                "#078E91",

              backgroundColor:
                "#E6F7F7",
            }}
          >
            <ApartmentOutlined />
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
              Organizations
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
              View and monitor registered
              organizations across the
              platform.
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          startIcon={
            <RefreshRounded />
          }
          disabled={
            organizationQuery
              .isFetching
          }
          onClick={() =>
            organizationQuery.refetch()
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
            1.5,

          mb:
            1.5,

          display:
            "grid",

          gridTemplateColumns: {
            xs:
              "1fr",

            md:
              "minmax(260px, 1fr) 190px",
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
          value={
            search
          }
          placeholder="Search organization..."
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
                | OrganizationStatus
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
                      Status
                    </Box>
                  );
                }

                return selected ===
                  "ACTIVE"
                  ? "Active"
                  : "Inactive";
              },
            },
          }}
        >
          <MenuItem value="">
            All Status
          </MenuItem>

          <MenuItem value="ACTIVE">
            Active
          </MenuItem>

          <MenuItem value="INACTIVE">
            Inactive
          </MenuItem>
        </TextField>
      </Paper>

      {/* ================================================== */}
      {/* LOADING */}
      {/* ================================================== */}

      {organizationQuery
        .isLoading && (
        <Paper
          elevation={0}
          sx={{
            minHeight:
              260,

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

      {organizationQuery
        .isError && (
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
            Unable to load organizations.
          </Typography>

          <Button
            sx={{
              mt:
                1,
            }}
            onClick={() =>
              organizationQuery.refetch()
            }
          >
            Try Again
          </Button>
        </Paper>
      )}

      {/* ================================================== */}
      {/* TABLE */}
      {/* ================================================== */}

      {!organizationQuery
        .isLoading &&
        !organizationQuery
          .isError && (
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
            <Table
              sx={{
                minWidth:
                  1050,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={
                        sortBy ===
                        "orgId"
                      }
                      direction={
                        sortBy ===
                        "orgId"
                          ? sortDir
                          : "asc"
                      }
                      onClick={() =>
                        handleSort(
                          "orgId"
                        )
                      }
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    <TableSortLabel
                      active={
                        sortBy ===
                        "orgName"
                      }
                      direction={
                        sortBy ===
                        "orgName"
                          ? sortDir
                          : "asc"
                      }
                      onClick={() =>
                        handleSort(
                          "orgName"
                        )
                      }
                    >
                      Organization
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    Category
                  </TableCell>

                  <TableCell>
                    Email
                  </TableCell>

                  <TableCell>
                    Phone
                  </TableCell>

                  <TableCell>
                    Location
                  </TableCell>

                  <TableCell>
                    Status
                  </TableCell>

                  <TableCell>
                    Created On
                  </TableCell>

                  <TableCell
                    align="right"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {organizations.map(
                  (
                    organization
                  ) => (
                    <TableRow
                      hover
                      key={
                        organization
                          .orgId
                      }
                    >
                      <TableCell>
                        {
                          organization
                            .orgId
                        }
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
                            organization
                              .orgName
                          }
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {
                          organization
                            .categoryName ||
                          "-"
                        }
                      </TableCell>

                      <TableCell>
                        {
                          organization
                            .orgEmail ||
                          "-"
                        }
                      </TableCell>

                      <TableCell>
                        {
                          organization
                            .orgPhone ||
                          "-"
                        }
                      </TableCell>

                      <TableCell>
                        {formatLocation(
                          organization
                        )}
                      </TableCell>

                      <TableCell>
                        <OrganizationStatusChip
                          status={
                            organization
                              .status
                          }
                        />
                      </TableCell>

                      <TableCell>
                        {formatDateTime(
                          organization
                            .createOn
                        )}
                      </TableCell>

                      <TableCell
                        align="right"
                      >
                        <Tooltip title="View Organization">
                          <IconButton
                            size="small"
                            onClick={() =>
                              setSelectedOrganization(
                                organization
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

                {organizations.length ===
                  0 && (
                  <TableRow>
                    <TableCell
                      colSpan={
                        9
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
                        <ApartmentOutlined
                          sx={{
                            mb:
                              1,

                            fontSize:
                              36,

                            color:
                              "text.disabled",
                          }}
                        />

                        <Typography
                          sx={{
                            fontWeight:
                              700,

                            fontSize:
                              "0.84rem",
                          }}
                        >
                          No organizations found
                        </Typography>

                        <Typography
                          sx={{
                            mt:
                              0.4,

                            color:
                              "text.secondary",

                            fontSize:
                              "0.7rem",
                          }}
                        >
                          Try changing your search
                          or status filter.
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
                  event.target
                    .value
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
          Boolean(
            selectedOrganization
          )
        }
        onClose={() =>
          setSelectedOrganization(
            null
          )
        }
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Organization Details
        </DialogTitle>

        <DialogContent
          dividers
        >
          {selectedOrganization && (
            <Box
              sx={{
                display:
                  "grid",

                gridTemplateColumns: {
                  xs:
                    "1fr",

                  sm:
                    "repeat(2, minmax(0,1fr))",
                },

                gap:
                  2,
              }}
            >
              <DetailItem
                label="Organization Name"
                value={
                  selectedOrganization
                    .orgName
                }
              />

              <DetailItem
                label="Category"
                value={
                  selectedOrganization
                    .categoryName
                }
              />

              <DetailItem
                label="CIN"
                value={
                  selectedOrganization
                    .cin
                }
              />

              <DetailItem
                label="Registration Number"
                value={
                  selectedOrganization
                    .regNum
                }
              />

              <DetailItem
                label="Organization Email"
                value={
                  selectedOrganization
                    .orgEmail
                }
              />

              <DetailItem
                label="Organization Phone"
                value={
                  selectedOrganization
                    .orgPhone
                }
              />

              <DetailItem
                label="Contact"
                value={
                  selectedOrganization
                    .contact
                }
              />

              <DetailItem
                label="PAN"
                value={
                  selectedOrganization
                    .pan
                }
              />

              <DetailItem
                label="GST"
                value={
                  selectedOrganization
                    .gst
                }
              />

              <DetailItem
                label="City"
                value={
                  selectedOrganization
                    .city
                }
              />

              <DetailItem
                label="District"
                value={
                  selectedOrganization
                    .dist
                }
              />

              <DetailItem
                label="State"
                value={
                  selectedOrganization
                    .state
                }
              />

              <DetailItem
                label="Country"
                value={
                  selectedOrganization
                    .country
                }
              />

              <DetailItem
                label="PIN"
                value={
                  selectedOrganization
                    .pin
                }
              />

              <DetailItem
                label="Website"
                value={
                  selectedOrganization
                    .website
                }
              />

              <DetailItem
                label="Status"
                value={
                  selectedOrganization
                    .status
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
                <DetailItem
                  label="Address"
                  value={
                    selectedOrganization
                      .address
                  }
                />
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setSelectedOrganization(
                null
              )
            }
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function OrganizationStatusChip({
  status,
}: {
  status:
    string;
}) {
  const active =
    status ===
    "ACTIVE";

  return (
    <Chip
      size="small"
      label={
        active
          ? "Active"
          : "Inactive"
      }
      sx={{
        height:
          23,

        fontSize:
          "0.62rem",

        fontWeight:
          750,

        color:
          active
            ? "#067647"
            : "#B42318",

        backgroundColor:
          active
            ? "#ECFDF3"
            : "#FEF3F2",
      }}
    />
  );
}

function DetailItem({
  label,
  value,
}: {
  label:
    string;

  value:
    string | number | null | undefined;
}) {
  return (
    <Box>
      <Typography
        sx={{
          color:
            "text.secondary",

          fontSize:
            "0.66rem",

          fontWeight:
            650,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          mt:
            0.35,

          fontSize:
            "0.8rem",

          fontWeight:
            700,

          wordBreak:
            "break-word",
        }}
      >
        {value ||
          "-"}
      </Typography>
    </Box>
  );
}

function formatLocation(
  organization:
    OrganizationResponse
) {
  return (
    [
      organization.city,
      organization.state,
    ]
      .filter(Boolean)
      .join(", ") ||
    "-"
  );
}

function formatDateTime(
  value:
    string | null
) {
  if (
    !value
  ) {
    return "-";
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