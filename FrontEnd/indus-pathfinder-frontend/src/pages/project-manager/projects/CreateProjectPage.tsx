import {
  ArrowBackRounded,
  FolderOpenRounded,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  useNavigate,
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
  createProjectApi,
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

import ProjectForm from "../../../components/projects/ProjectForm";

export default function CreateProjectPage() {
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
  } =
    useForm<ProjectFormValues>({
      resolver:
        zodResolver(
          projectSchema
        ),

      defaultValues: {
        projectName: "",
        description: "",
        startDate: "",
        endDate: "",
        status:
          ProjectStatus.ACTIVE,
        priority:
          ProjectPriority.MEDIUM,
      },

      mode:
        "onTouched",
    });

  const mutation =
    useMutation({
      mutationFn:
        createProjectApi,

      onSuccess: (
        response
      ) => {
        enqueueSnackbar(
          `${response.projectCode} created successfully.`,
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
            "project-manager-dashboard",
          ],
        });

        const detailsPath =
          ROUTES
            .PROJECT_MANAGER
            .PROJECT_DETAILS
            .replace(
              ":projectId",
              String(
                response.projectId
              )
            );

        navigate(
          detailsPath,
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

  return (
    <Box
      sx={{
        width:
          "100%",
      }}
    >
      <Box
        sx={{
          maxWidth:
            980,

          mx:
            "auto",
        }}
      >
        <Button
          startIcon={
            <ArrowBackRounded />
          }
          onClick={() =>
            navigate(
              ROUTES
                .PROJECT_MANAGER
                .PROJECTS
            )
          }
          sx={{
            mb:
              2,

            px:
              0,

            color:
              "text.secondary",

            fontWeight:
              650,
          }}
        >
          Back to Projects
        </Button>

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
              3.5,

            backgroundColor:
              "#FFFFFF",

            boxShadow:
              "0 16px 45px rgba(25,56,91,0.07)",
          }}
        >
          <Box
            sx={{
              px: {
                xs:
                  2.5,

                md:
                  4,
              },

              py:
                3,

              display:
                "flex",

              alignItems:
                "center",

              gap:
                1.5,

              borderBottom:
                "1px solid",

              borderColor:
                "divider",

              backgroundColor:
                "#F8FAFC",
            }}
          >
            <Box
              sx={{
                width:
                  48,

                height:
                  48,

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                flexShrink:
                  0,

                borderRadius:
                  2.5,

                color:
                  "#FFFFFF",

                backgroundColor:
                  "#0C8F92",
              }}
            >
              <FolderOpenRounded />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize:
                    "1.3rem",

                  fontWeight:
                    750,

                  letterSpacing:
                    "-0.025em",
                }}
              >
                Create Project
              </Typography>

              <Typography
                sx={{
                  mt:
                    0.3,

                  color:
                    "text.secondary",

                  fontSize:
                    "0.78rem",
                }}
              >
                Define the project schedule,
                status and priority.
              </Typography>
            </Box>
          </Box>

          <Box
            component="form"
            noValidate
            onSubmit={
              handleSubmit(
                (
                  values
                ) =>
                  mutation.mutate(
                    values
                  )
              )
            }
            sx={{
              p: {
                xs:
                  2.5,

                md:
                  4,
              },
            }}
          >
            <ProjectForm
              control={
                control
              }
              submitting={
                mutation
                  .isPending
              }
              submitLabel="Create Project"
              onCancel={() =>
                navigate(
                  ROUTES
                    .PROJECT_MANAGER
                    .PROJECTS
                )
              }
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}