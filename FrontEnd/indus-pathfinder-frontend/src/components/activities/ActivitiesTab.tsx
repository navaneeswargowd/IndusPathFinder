import {
  AddRounded,
  RefreshRounded,
  SearchRounded,
} from "@mui/icons-material";

import {
  Box,
  Button,
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
  createActivityApi,
  deleteActivityApi,
  searchActivitiesApi,
  updateActivityApi,
} from "../../api/activity.api";

import {
  ActivityStatus,
} from "../../enums/activity.enums";

import type {
  ActivitySearchResponse,
} from "../../types/activity.types";

import type {
  ActivityFormValues,
} from "../../schemas/activity.schema";

import {
  getErrorMessage,
} from "../../utils/error.utils";

import ActivityTable from "./ActivityTable";
import ActivityFormDialog from "./ActivityFormDialog";
import ActivityDetailsDialog from "./ActivityDetailsDialog";
import DeleteActivityDialog from "./DeleteActivityDialog";

interface ActivitiesTabProps {
  projectId:
    number;

  projectStartDate:
    string;

  projectEndDate:
    string;
}

export default function ActivitiesTab({
  projectId,
  projectStartDate,
  projectEndDate,
}: ActivitiesTabProps) {
  const {
    enqueueSnackbar,
  } =
    useSnackbar();

  const queryClient =
    useQueryClient();

  const [
    search,
    setSearch,
  ] =
    useState(
      ""
    );

  const [
    appliedSearch,
    setAppliedSearch,
  ] =
    useState(
      ""
    );

  const [
    status,
    setStatus,
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
    activityToEdit,
    setActivityToEdit,
  ] =
    useState<
      ActivitySearchResponse | null
    >(
      null
    );

  const [
    selectedActId,
    setSelectedActId,
  ] =
    useState<
      number | null
    >(
      null
    );

  const [
    activityToDelete,
    setActivityToDelete,
  ] =
    useState<
      ActivitySearchResponse | null
    >(
      null
    );

  const query =
    useQuery({
      queryKey: [
        "activities",
        projectId,
        appliedSearch,
        status,
        page,
        size,
      ],

      queryFn:
        () =>
          searchActivitiesApi({
            projectId,

            actName:
              appliedSearch ||
              undefined,

            status:
              status
                ? (
                    status as typeof ActivityStatus[keyof typeof ActivityStatus]
                  )
                : undefined,

            page,

            size,

            sortBy:
              "actId",

            direction:
              "asc",
          }),

      staleTime:
        15_000,
    });

  const refresh =
    () => {
      void queryClient.invalidateQueries({
        queryKey: [
          "activities",
          projectId,
        ],
      });

      void queryClient.invalidateQueries({
        queryKey: [
          "project-manager-dashboard",
        ],
      });
    };

  const createMutation =
    useMutation({
      mutationFn:
        createActivityApi,

      onSuccess:
        (
          response
        ) => {
          enqueueSnackbar(
            `${response.actCode} created successfully.`,
            {
              variant:
                "success",
            }
          );

          setFormOpen(
            false
          );

          refresh();
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

  const updateMutation =
    useMutation({
      mutationFn:
        updateActivityApi,

      onSuccess:
        () => {
          enqueueSnackbar(
            "Activity updated successfully.",
            {
              variant:
                "success",
            }
          );

          setActivityToEdit(
            null
          );

          setFormOpen(
            false
          );

          refresh();
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

  const deleteMutation =
    useMutation({
      mutationFn:
        deleteActivityApi,

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

          setActivityToDelete(
            null
          );

          refresh();
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

  const handleFormSubmit =
    (
      values:
        ActivityFormValues
    ) => {
      if (
        activityToEdit
      ) {
        updateMutation.mutate({
          actId:
            activityToEdit.actId,

          projectId,

          ...values,
        });

        return;
      }

      createMutation.mutate({
        projectId,

        ...values,
      });
    };

  const activities =
    query.data
      ?.content ??
    [];

  return (
    <Box>
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

            md:
              "minmax(280px, 1fr) 190px auto auto",
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
          placeholder="Search activities..."
          value={
            search
          }
          onChange={(
            event
          ) =>
            setSearch(
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

              setAppliedSearch(
                search.trim()
              );
            }
          }}
          slotProps={{
            input: {
              startAdornment:
                (
                  <SearchRounded
                    sx={{
                      mr:
                        1,

                      color:
                        "text.disabled",
                    }}
                  />
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
    setPage(
      0
    );

    setStatus(
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
              Status
            </Box>
          );
        }

        switch (
          selected
        ) {
          case ActivityStatus.NOT_STARTED:
            return "Not Started";

          case ActivityStatus.IN_PROGRESS:
            return "In Progress";

          case ActivityStatus.COMPLETED:
            return "Completed";

          default:
            return selected as string;
        }
      },
    },
  }}
>
  <MenuItem value="">
    All statuses
  </MenuItem>

  <MenuItem
    value={
      ActivityStatus.NOT_STARTED
    }
  >
    Not Started
  </MenuItem>

  <MenuItem
    value={
      ActivityStatus.IN_PROGRESS
    }
  >
    In Progress
  </MenuItem>

  <MenuItem
    value={
      ActivityStatus.COMPLETED
    }
  >
    Completed
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
            setActivityToEdit(
              null
            );

            setFormOpen(
              true
            );
          }}
          sx={{
            backgroundColor:
              "#078E91",

            "&:hover":
              {
                backgroundColor:
                  "#067A7D",
              },
          }}
        >
          Add Activity
        </Button>
      </Paper>

      <ActivityTable
        activities={
          activities
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
          activity
        ) =>
          setSelectedActId(
            activity.actId
          )
        }
        onEdit={(
          activity
        ) => {
          setActivityToEdit(
            activity
          );

          setFormOpen(
            true
          );
        }}
        onDelete={(
          activity
        ) =>
          setActivityToDelete(
            activity
          )
        }
      />

      <ActivityFormDialog
        open={
          formOpen
        }
        loading={
          createMutation.isPending ||
          updateMutation.isPending
        }
        activity={
          activityToEdit
        }
        projectStartDate={
          projectStartDate
        }
        projectEndDate={
          projectEndDate
        }
        onClose={() => {
          setFormOpen(
            false
          );

          setActivityToEdit(
            null
          );
        }}
        onSubmit={
          handleFormSubmit
        }
      />

      <ActivityDetailsDialog
        actId={
          selectedActId
        }
        open={
          selectedActId !==
          null
        }
        onClose={() =>
          setSelectedActId(
            null
          )
        }
      />

      <DeleteActivityDialog
        activity={
          activityToDelete
        }
        open={
          activityToDelete !==
          null
        }
        loading={
          deleteMutation.isPending
        }
        onClose={() =>
          setActivityToDelete(
            null
          )
        }
        onConfirm={() => {
          if (
            !activityToDelete
          ) {
            return;
          }

          deleteMutation.mutate({
            actId:
              activityToDelete.actId,
          });
        }}
      />
    </Box>
  );
}