import {
  AddRounded,
  RefreshRounded,
  SearchRounded,
} from "@mui/icons-material";

import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
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
  createDependencyApi,
  deleteDependencyApi,
  searchDependenciesApi,
  updateDependencyApi,
} from "../../api/dependency.api";

import {
  DependencyType,
} from "../../enums/dependency.enums";

import type {
  DependencySearchResponse,
} from "../../types/dependency.types";

import type {
  DependencyFormValues,
} from "../../schemas/dependency.schema";

import {
  getErrorMessage,
} from "../../utils/error.utils";

import DependencyTable from "./DependencyTable";
import DependencyFormDialog from "./DependencyFormDialog";
import DependencyDetailsDialog from "./DependencyDetailsDialog";
import DeleteDependencyDialog from "./DeleteDependencyDialog";

interface DependenciesTabProps {
  projectId:
    number;
}

export default function DependenciesTab({
  projectId,
}: DependenciesTabProps) {
  const {
    enqueueSnackbar,
  } =
    useSnackbar();

  const queryClient =
    useQueryClient();

  const [
    predecessorSearch,
    setPredecessorSearch,
  ] =
    useState(
      ""
    );

  const [
    successorSearch,
    setSuccessorSearch,
  ] =
    useState(
      ""
    );

  const [
    appliedPredecessor,
    setAppliedPredecessor,
  ] =
    useState(
      ""
    );

  const [
    appliedSuccessor,
    setAppliedSuccessor,
  ] =
    useState(
      ""
    );

  const [
    type,
    setType,
  ] =
    useState(
      ""
    );

  const [
    page,
    setPage,
  ] =
    useState(
      0
    );

  const [
    size,
    setSize,
  ] =
    useState(
      10
    );

  const [
    formOpen,
    setFormOpen,
  ] =
    useState(
      false
    );

  const [
    editingDependencyId,
    setEditingDependencyId,
  ] =
    useState<
      number | null
    >(
      null
    );

  const [
    selectedDependencyId,
    setSelectedDependencyId,
  ] =
    useState<
      number | null
    >(
      null
    );

  const [
    dependencyToDelete,
    setDependencyToDelete,
  ] =
    useState<
      DependencySearchResponse | null
    >(
      null
    );

  // ==========================================================
  // SEARCH
  // ==========================================================

  const query =
    useQuery({
      queryKey: [
        "dependencies",
        projectId,
        appliedPredecessor,
        appliedSuccessor,
        type,
        page,
        size,
      ],

      queryFn: () =>
        searchDependenciesApi({
          projectId,

          predecessorActivityName:
            appliedPredecessor ||
            undefined,

          successorActivityName:
            appliedSuccessor ||
            undefined,

          dependencyType:
            type
              ? (
                  type as DependencyType
                )
              : undefined,

          page,

          size,

          sortBy:
            "dependencyId",

          direction:
            "asc",
        }),

      staleTime:
        15_000,
    });

  const refreshDependencies =
    () => {
      void queryClient.invalidateQueries({
        queryKey: [
          "dependencies",
          projectId,
        ],
      });

      void queryClient.invalidateQueries({
        queryKey: [
          "project-manager-dashboard",
        ],
      });
    };

  // ==========================================================
  // CREATE
  // ==========================================================

  const createMutation =
    useMutation({
      mutationFn:
        createDependencyApi,

      onSuccess:
        () => {
          enqueueSnackbar(
            "Dependency created successfully.",
            {
              variant:
                "success",
            }
          );

          setFormOpen(
            false
          );

          refreshDependencies();
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

  // ==========================================================
  // UPDATE
  // ==========================================================

  const updateMutation =
    useMutation({
      mutationFn:
        updateDependencyApi,

      onSuccess:
        () => {
          enqueueSnackbar(
            "Dependency updated successfully.",
            {
              variant:
                "success",
            }
          );

          setEditingDependencyId(
            null
          );

          setFormOpen(
            false
          );

          refreshDependencies();
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

  // ==========================================================
  // DELETE
  // ==========================================================

  const deleteMutation =
    useMutation({
      mutationFn:
        deleteDependencyApi,

      onSuccess:
        (
          response
        ) => {
          enqueueSnackbar(
            response.message,
            {
              variant:
                "success",
            }
          );

          setDependencyToDelete(
            null
          );

          refreshDependencies();
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

  // ==========================================================
  // FORM SUBMIT
  // ==========================================================

  const handleFormSubmit =
    (
      values:
        DependencyFormValues
    ) => {
      if (
        editingDependencyId !==
        null
      ) {
        updateMutation.mutate({
          dependencyId:
            editingDependencyId,

          predecessorActivityId:
            values
              .predecessorActivityId,

          successorActivityId:
            values
              .successorActivityId,

          dependencyType:
            values
              .dependencyType,
        });

        return;
      }

      createMutation.mutate({
        projectId,

        predecessorActivityId:
          values
            .predecessorActivityId,

        successorActivityId:
          values
            .successorActivityId,

        dependencyType:
          values
            .dependencyType,
      });
    };

  const dependencies =
    query.data
      ?.content ??
    [];

  return (
    <Box>
      {/* ====================================================== */}
      {/* FILTER TOOLBAR */}
      {/* ====================================================== */}

      <Paper
        elevation={0}
        sx={{
          mb:
            1.5,

          p:
            1.5,

          display:
            "grid",

          gridTemplateColumns: {
            xs:
              "1fr",

            lg:
              "minmax(200px, 1fr) minmax(200px, 1fr) 170px auto auto",
          },

          alignItems:
            "center",

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
          placeholder="Predecessor activity..."
          value={
            predecessorSearch
          }
          onChange={(
            event
          ) =>
            setPredecessorSearch(
              event.target.value
            )
          }
          onKeyDown={(
            event
          ) => {
            if (
              event.key ===
              "Enter"
            ) {
              setPage(
                0
              );

              setAppliedPredecessor(
                predecessorSearch.trim()
              );

              setAppliedSuccessor(
                successorSearch.trim()
              );
            }
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
          size="small"
          placeholder="Successor activity..."
          value={
            successorSearch
          }
          onChange={(
            event
          ) =>
            setSuccessorSearch(
              event.target.value
            )
          }
          onKeyDown={(
            event
          ) => {
            if (
              event.key ===
              "Enter"
            ) {
              setPage(
                0
              );

              setAppliedPredecessor(
                predecessorSearch.trim()
              );

              setAppliedSuccessor(
                successorSearch.trim()
              );
            }
          }}
        />

<TextField
  select
  size="small"
  value={
    type
  }
  onChange={(
    event
  ) => {
    setPage(
      0
    );

    setType(
      event.target.value
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
              Type
            </Box>
          );
        }

        return selected as string;
      },
    },
  }}
>
  <MenuItem value="">
    All types
  </MenuItem>

  <MenuItem
    value={
      DependencyType.FS
    }
  >
    FS
  </MenuItem>

  <MenuItem
    value={
      DependencyType.SS
    }
  >
    SS
  </MenuItem>

  <MenuItem
    value={
      DependencyType.FF
    }
  >
    FF
  </MenuItem>

  <MenuItem
    value={
      DependencyType.SF
    }
  >
    SF
  </MenuItem>
</TextField>

        <Button
          variant="outlined"
          startIcon={
            <RefreshRounded />
          }
          disabled={
            query.isFetching
          }
          onClick={() =>
            query.refetch()
          }
        >
          Refresh
        </Button>

        <Button
          variant="contained"
          startIcon={
            <AddRounded />
          }
          onClick={() => {
            setEditingDependencyId(
              null
            );

            setFormOpen(
              true
            );
          }}
          sx={{
            whiteSpace:
              "nowrap",

            backgroundColor:
              "#078E91",

            "&:hover":
              {
                backgroundColor:
                  "#067A7D",
              },
          }}
        >
          Add Dependency
        </Button>
      </Paper>

      {/* ====================================================== */}
      {/* TABLE */}
      {/* ====================================================== */}

      <DependencyTable
        dependencies={
          dependencies
        }
        page={
          page
        }
        size={
          size
        }
        totalElements={
          query.data
            ?.totalElements ??
          0
        }
        onPageChange={
          setPage
        }
        onSizeChange={(
          newSize
        ) => {
          setSize(
            newSize
          );

          setPage(
            0
          );
        }}
        onView={(
          dependency
        ) =>
          setSelectedDependencyId(
            dependency
              .dependencyId
          )
        }
        onEdit={(
          dependency
        ) => {
          setEditingDependencyId(
            dependency
              .dependencyId
          );

          setFormOpen(
            true
          );
        }}
        onDelete={(
          dependency
        ) =>
          setDependencyToDelete(
            dependency
          )
        }
      />

      {/* ====================================================== */}
      {/* CREATE / EDIT */}
      {/* ====================================================== */}

      <DependencyFormDialog
        open={
          formOpen
        }
        loading={
          createMutation.isPending ||
          updateMutation.isPending
        }
        projectId={
          projectId
        }
        dependencyId={
          editingDependencyId
        }
        onClose={() => {
          setFormOpen(
            false
          );

          setEditingDependencyId(
            null
          );
        }}
        onSubmit={
          handleFormSubmit
        }
      />

      {/* ====================================================== */}
      {/* DETAILS */}
      {/* ====================================================== */}

      <DependencyDetailsDialog
        dependencyId={
          selectedDependencyId
        }
        open={
          selectedDependencyId !==
          null
        }
        onClose={() =>
          setSelectedDependencyId(
            null
          )
        }
      />

      {/* ====================================================== */}
      {/* DELETE */}
      {/* ====================================================== */}

      <DeleteDependencyDialog
        dependency={
          dependencyToDelete
        }
        open={
          dependencyToDelete !==
          null
        }
        loading={
          deleteMutation.isPending
        }
        onClose={() =>
          setDependencyToDelete(
            null
          )
        }
        onConfirm={() => {
          if (
            !dependencyToDelete
          ) {
            return;
          }

          deleteMutation.mutate({
            dependencyId:
              dependencyToDelete
                .dependencyId,
          });
        }}
      />
    </Box>
  );
}