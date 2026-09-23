import {
  AddRounded,
  CategoryOutlined,
  DeleteOutlineRounded,
  EditOutlined,
  RefreshRounded,
  SearchRounded,
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
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  useSnackbar,
} from "notistack";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  categorySchema,
  type CategoryFormValues,
} from "../../../schemas/category.schema";

import {
  createCategoryApi,
  deleteCategoryApi,
  searchCategoriesApi,
  updateCategoryApi,
} from "../../../api/category.api";

import type {
  CategoryResponse,
  CategoryStatus,
} from "../../../types/category.types";

import {
  getErrorMessage,
} from "../../../utils/error.utils";

export default function CategoriesPage() {
  const queryClient =
    useQueryClient();

  const {
    enqueueSnackbar,
  } =
    useSnackbar();

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
      "" | CategoryStatus
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
      "categoryId"
    );

  const [
    sortDir,
    setSortDir,
  ] =
    useState<
      "asc" | "desc"
    >("asc");

  const [
    formOpen,
    setFormOpen,
  ] =
    useState(false);

  const [
    editingCategory,
    setEditingCategory,
  ] =
    useState<
      CategoryResponse | null
    >(null);

  const [
    deleteTarget,
    setDeleteTarget,
  ] =
    useState<
      CategoryResponse | null
    >(null);

  /*
   * ========================================================
   * FORM
   * ========================================================
   */

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } =
    useForm<CategoryFormValues>({
      resolver:
        zodResolver(
          categorySchema
        ),

      defaultValues: {
        categoryName:
          "",

        status:
          "ACTIVE",
      },
    });

  /*
   * ========================================================
   * SEARCH QUERY
   * ========================================================
   */

  const categoryQuery =
    useQuery({
      queryKey: [
        "admin-categories",
        search,
        status,
        page,
        size,
        sortBy,
        sortDir,
      ],

      queryFn:
        () =>
          searchCategoriesApi({
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
   * CREATE
   * ========================================================
   */

  const createMutation =
    useMutation({
      mutationFn:
        createCategoryApi,

      onSuccess:
        () => {
          enqueueSnackbar(
            "Category created successfully.",
            {
              variant:
                "success",
            }
          );

          closeForm();

          refreshCategories();
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
   * UPDATE
   * ========================================================
   */

  const updateMutation =
    useMutation({
      mutationFn:
        ({
          categoryId,
          values,
        }: {
          categoryId:
            number;

          values:
            CategoryFormValues;
        }) =>
          updateCategoryApi(
            categoryId,
            values
          ),

      onSuccess:
        () => {
          enqueueSnackbar(
            "Category updated successfully.",
            {
              variant:
                "success",
            }
          );

          closeForm();

          refreshCategories();
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
   * DELETE
   * ========================================================
   */

  const deleteMutation =
    useMutation({
      mutationFn:
        deleteCategoryApi,

      onSuccess:
        (
          message
        ) => {
          enqueueSnackbar(
            message ||
              "Category deleted successfully.",
            {
              variant:
                "success",
            }
          );

          setDeleteTarget(
            null
          );

          refreshCategories();
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

  const refreshCategories =
    () => {
      void queryClient.invalidateQueries({
        queryKey: [
          "admin-categories",
        ],
      });
    };

  /*
   * ========================================================
   * OPEN CREATE
   * ========================================================
   */

  const openCreate =
    () => {
      setEditingCategory(
        null
      );

      reset({
        categoryName:
          "",

        status:
          "ACTIVE",
      });

      setFormOpen(
        true
      );
    };

  /*
   * ========================================================
   * OPEN EDIT
   * ========================================================
   */

  const openEdit =
    (
      category:
        CategoryResponse
    ) => {
      setEditingCategory(
        category
      );

      reset({
        categoryName:
          category.categoryName,

        status:
          category.status,
      });

      setFormOpen(
        true
      );
    };

  const closeForm =
    () => {
      setFormOpen(
        false
      );

      setEditingCategory(
        null
      );

      reset({
        categoryName:
          "",

        status:
          "ACTIVE",
      });
    };

  /*
   * ========================================================
   * SUBMIT
   * ========================================================
   */

  const submitForm =
    (
      values:
        CategoryFormValues
    ) => {
      if (
        editingCategory
      ) {
        updateMutation.mutate({
          categoryId:
            editingCategory.categoryId,

          values,
        });

        return;
      }

      createMutation.mutate(
        values
      );
    };

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

  const categories =
    categoryQuery.data
      ?.content ??
    [];

  const totalElements =
    categoryQuery.data
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
            <CategoryOutlined />
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
              Categories
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
              Manage organization
              categories used during
              registration.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display:
              "flex",

            gap:
              1,
          }}
        >
          <Button
            variant="outlined"
            startIcon={
              <RefreshRounded />
            }
            disabled={
              categoryQuery
                .isFetching
            }
            onClick={() =>
              categoryQuery.refetch()
            }
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={
              <AddRounded />
            }
            onClick={
              openCreate
            }
          >
            Add Category
          </Button>
        </Box>
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
              "minmax(250px, 1fr) 190px",
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
          placeholder="Search category name..."
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
        | CategoryStatus
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

        if (
          selected ===
          "ACTIVE"
        ) {
          return "Active";
        }

        if (
          selected ===
          "INACTIVE"
        ) {
          return "Inactive";
        }

        return selected as string;
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

      {categoryQuery.isLoading && (
        <Paper
          elevation={0}
          sx={{
            minHeight:
              250,

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

      {categoryQuery.isError && (
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
            Unable to load categories.
          </Typography>

          <Button
            sx={{
              mt:
                1,
            }}
            onClick={() =>
              categoryQuery.refetch()
            }
          >
            Try Again
          </Button>
        </Paper>
      )}

      {/* ================================================== */}
      {/* TABLE */}
      {/* ================================================== */}

      {!categoryQuery.isLoading &&
        !categoryQuery.isError && (
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
                  <TableCell>
                    <TableSortLabel
                      active={
                        sortBy ===
                        "categoryId"
                      }
                      direction={
                        sortBy ===
                        "categoryId"
                          ? sortDir
                          : "asc"
                      }
                      onClick={() =>
                        handleSort(
                          "categoryId"
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
                        "categoryName"
                      }
                      direction={
                        sortBy ===
                        "categoryName"
                          ? sortDir
                          : "asc"
                      }
                      onClick={() =>
                        handleSort(
                          "categoryName"
                        )
                      }
                    >
                      Category Name
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    Status
                  </TableCell>

                  <TableCell>
                    Created On
                  </TableCell>

                  <TableCell>
                    Updated On
                  </TableCell>

                  <TableCell
                    align="right"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {categories.map(
                  (
                    category
                  ) => (
                    <TableRow
                      hover
                      key={
                        category.categoryId
                      }
                    >
                      <TableCell>
                        {
                          category.categoryId
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
                            category.categoryName
                          }
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <CategoryStatusChip
                          status={
                            category.status
                          }
                        />
                      </TableCell>

                      <TableCell>
                        {formatDateTime(
                          category.createOn
                        )}
                      </TableCell>

                      <TableCell>
                        {formatDateTime(
                          category.updateOn
                        )}
                      </TableCell>

                      <TableCell
                        align="right"
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() =>
                              openEdit(
                                category
                              )
                            }
                          >
                            <EditOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              setDeleteTarget(
                                category
                              )
                            }
                          >
                            <DeleteOutlineRounded fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                )}

                {categories.length ===
                  0 && (
                  <TableRow>
                    <TableCell
                      colSpan={
                        6
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
                        <CategoryOutlined
                          sx={{
                            mb:
                              1,

                            fontSize:
                              34,

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
                          No categories found
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
                          Create a category
                          or change your
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
      {/* CREATE / EDIT DIALOG */}
      {/* ================================================== */}

      <Dialog
        open={
          formOpen
        }
        onClose={
          closeForm
        }
        fullWidth
        maxWidth="sm"
      >
        <Box
          component="form"
          onSubmit={
            handleSubmit(
              submitForm
            )
          }
        >
          <DialogTitle>
            {editingCategory
              ? "Edit Category"
              : "Create Category"}
          </DialogTitle>

          <DialogContent>
            <Box
              sx={{
                pt:
                  1,

                display:
                  "grid",

                gap:
                  2,
              }}
            >
              <TextField
                label="Category Name"
                fullWidth
                autoFocus
                error={
                  Boolean(
                    errors
                      .categoryName
                  )
                }
                helperText={
                  errors
                    .categoryName
                    ?.message
                }
                {...register(
                  "categoryName"
                )}
              />

              {editingCategory && (
                <TextField
                  select
                  label="Status"
                  fullWidth
                  defaultValue={
                    editingCategory.status
                  }
                  {...register(
                    "status"
                  )}
                >
                  <MenuItem value="ACTIVE">
                    Active
                  </MenuItem>

                  <MenuItem value="INACTIVE">
                    Inactive
                  </MenuItem>
                </TextField>
              )}

              {!editingCategory && (
                <input
                  type="hidden"
                  value="ACTIVE"
                  {...register(
                    "status"
                  )}
                />
              )}
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              px:
                3,

              pb:
                2.5,
            }}
          >
            <Button
              onClick={
                closeForm
              }
              disabled={
                createMutation
                  .isPending ||
                updateMutation
                  .isPending
              }
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              type="submit"
              disabled={
                createMutation
                  .isPending ||
                updateMutation
                  .isPending
              }
            >
              {editingCategory
                ? "Update Category"
                : "Create Category"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* ================================================== */}
      {/* DELETE CONFIRMATION */}
      {/* ================================================== */}

      <Dialog
        open={
          Boolean(
            deleteTarget
          )
        }
        onClose={() =>
          setDeleteTarget(
            null
          )
        }
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          Delete Category
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              color:
                "text.secondary",

              fontSize:
                "0.8rem",

              lineHeight:
                1.6,
            }}
          >
            Are you sure you want to
            delete{" "}
            <strong>
              {
                deleteTarget
                  ?.categoryName
              }
            </strong>
            ?
          </Typography>

          <Typography
            sx={{
              mt:
                1,

              color:
                "error.main",

              fontSize:
                "0.7rem",
            }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            px:
              3,

            pb:
              2.5,
          }}
        >
          <Button
            onClick={() =>
              setDeleteTarget(
                null
              )
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            disabled={
              deleteMutation
                .isPending
            }
            onClick={() => {
              if (
                deleteTarget
              ) {
                deleteMutation.mutate(
                  deleteTarget.categoryId
                );
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/*
 * ==========================================================
 * STATUS CHIP
 * ==========================================================
 */

function CategoryStatusChip({
  status,
}: {
  status:
    CategoryStatus;
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

/*
 * ==========================================================
 * DATE FORMAT
 * ==========================================================
 */

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