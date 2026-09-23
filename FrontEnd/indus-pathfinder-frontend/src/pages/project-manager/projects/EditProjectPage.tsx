import {
  Box,
  Button,
} from "@mui/material";

import {
  useEffect,
} from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  useSnackbar,
} from "notistack";

import {
  getProjectDetailsApi,
  updateProjectApi,
} from "../../../api/project.api";

import {
  ProjectPriority,
  ProjectStatus,
} from "../../../enums/project.enums";

import {
  projectSchema,
  type ProjectFormValues,
} from "../../../schemas/project.schema";

import {
  ROUTES,
} from "../../../config/routes.config";

import {
  getErrorMessage,
} from "../../../utils/error.utils";

import PageHeader from "../../../components/display/PageHeader";

import PageLoader from "../../../components/feedback/PageLoader";

import ErrorState from "../../../components/feedback/ErrorState";

import ProjectForm from "../../../components/projects/ProjectForm";

export default function EditProjectPage() {
  const {
    projectId,
  } =
    useParams<{
      projectId:
        string;
    }>();

  const numericProjectId =
    Number(projectId);

  const navigate =
    useNavigate();

  const {
    enqueueSnackbar,
  } = useSnackbar();

  const queryClient =
    useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
  } =
    useForm<ProjectFormValues>({
      resolver:
        zodResolver(
          projectSchema
        ),

      defaultValues: {
        projectName:
          "",

        description:
          "",

        startDate:
          "",

        endDate:
          "",

        status:
          ProjectStatus.ACTIVE,

        priority:
          ProjectPriority.MEDIUM,
      },

      mode:
        "onTouched",
    });

  const detailsQuery =
    useQuery({
      queryKey: [
        "project-details",
        numericProjectId,
      ],

      queryFn: () =>
        getProjectDetailsApi({
          projectId:
            numericProjectId,
        }),

      enabled:
        Number.isFinite(
          numericProjectId
        ) &&
        numericProjectId >
          0,
    });

  useEffect(() => {
    if (
      !detailsQuery.data
    ) {
      return;
    }

    reset({
      projectName:
        detailsQuery.data
          .projectName,

      description:
        detailsQuery.data
          .description ??
        "",

      startDate:
        detailsQuery.data
          .startDate,

      endDate:
        detailsQuery.data
          .endDate,

      status:
        detailsQuery.data
          .status,

      priority:
        detailsQuery.data
          .priority,
    });
  }, [
    detailsQuery.data,
    reset,
  ]);

  const mutation =
    useMutation({
      mutationFn:
        updateProjectApi,

      onSuccess: (
        response
      ) => {
        enqueueSnackbar(
          `${response.projectCode} updated successfully.`,
          {
            variant:
              "success",
          }
        );

        void queryClient.invalidateQueries({
          queryKey: [
            "projects",
          ],
        });

        void queryClient.invalidateQueries({
          queryKey: [
            "project-details",
            numericProjectId,
          ],
        });

        void queryClient.invalidateQueries({
          queryKey: [
            "header-notifications",
          ],
        });

        navigate(
          ROUTES.PROJECT_MANAGER
            .PROJECTS,
          {
            replace:
              true,
          }
        );
      },

      onError: (
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

  if (
    !Number.isFinite(
      numericProjectId
    ) ||
    numericProjectId <=
      0
  ) {
    return (
      <ErrorState
        title="Invalid Project"
        message="The project ID is invalid."
      />
    );
  }

  if (
    detailsQuery.isLoading
  ) {
    return (
      <PageLoader
        message="Loading project..."
      />
    );
  }

  if (
    detailsQuery.isError
  ) {
    return (
      <ErrorState
        title="Project unavailable"
        message="Unable to load the selected project."
        action={
          <Button
            onClick={() =>
              navigate(
                ROUTES.PROJECT_MANAGER
                  .PROJECTS
              )
            }
          >
            Back to Projects
          </Button>
        }
      />
    );
  }

  return (
    <Box>
      <PageHeader
        title="Edit Project"
        description={
          detailsQuery.data
            ? `Update ${detailsQuery.data.projectCode} - ${detailsQuery.data.projectName}`
            : "Update project"
        }
      />

      <Box
        component="form"
        noValidate
        onSubmit={
          handleSubmit(
            (values) =>
              mutation.mutate({
                projectId:
                  numericProjectId,

                ...values,
              })
          )
        }
      >
        <ProjectForm
          control={
            control
          }
          submitting={
            mutation.isPending
          }
          submitLabel="Save Changes"
          onCancel={() =>
            navigate(
              ROUTES.PROJECT_MANAGER
                .PROJECTS
            )
          }
        />
      </Box>
    </Box>
  );
}