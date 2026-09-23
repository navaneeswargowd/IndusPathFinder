import {
  AddRounded,
  FolderOpenRounded,
  RefreshRounded,
  SearchRounded,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Chip,
  Paper,
  Typography,
} from "@mui/material";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useSnackbar,
} from "notistack";

import {
  deleteProjectApi,
  searchProjectsApi,
} from "../../../api/project.api";

import {
  ProjectPriority,
  ProjectStatus,
} from "../../../enums/project.enums";

import type {
  ProjectSearchResponse,
} from "../../../types/project.types";

import {
  ROUTES,
} from "../../../config/routes.config";

import {
  getErrorMessage,
} from "../../../utils/error.utils";

import ProjectFilters, {
  type ProjectFilterValues,
} from "../../../components/projects/ProjectFilters";

import ProjectTable from "../../../components/projects/ProjectTable";

import ProjectDetailsDialog from "../../../components/projects/ProjectDetailsDialog";

import DeleteProjectDialog from "../../../components/projects/DeleteProjectDialog";

const EMPTY_FILTERS:
  ProjectFilterValues = {
    projectCode:
      "",

    projectName:
      "",

    status:
      "",

    priority:
      "",
  };

export default function ProjectListPage() {
  const navigate =
    useNavigate();

  const {
    enqueueSnackbar,
  } =
    useSnackbar();

  const queryClient =
    useQueryClient();

  const [
    draftFilters,
    setDraftFilters,
  ] =
    useState<ProjectFilterValues>(
      EMPTY_FILTERS
    );

  const [
    appliedFilters,
    setAppliedFilters,
  ] =
    useState<ProjectFilterValues>(
      EMPTY_FILTERS
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
    sortBy,
    setSortBy,
  ] =
    useState(
      "projectId"
    );

  const [
    direction,
    setDirection,
  ] =
    useState<
      "asc" | "desc"
    >(
      "asc"
    );

  const [
    selectedProjectId,
    setSelectedProjectId,
  ] =
    useState<
      number | null
    >(
      null
    );

  const [
    projectToDelete,
    setProjectToDelete,
  ] =
    useState<
      ProjectSearchResponse | null
    >(
      null
    );

  const projectsQuery =
    useQuery({
      queryKey: [
        "projects",
        appliedFilters,
        page,
        size,
        sortBy,
        direction,
      ],

      queryFn:
        () =>
          searchProjectsApi({
            projectCode:
              appliedFilters
                .projectCode
                .trim() ||
              undefined,

            projectName:
              appliedFilters
                .projectName
                .trim() ||
              undefined,

            status:
              appliedFilters
                .status
                ? (
                    appliedFilters
                      .status as ProjectStatus
                  )
                : undefined,

            priority:
              appliedFilters
                .priority
                ? (
                    appliedFilters
                      .priority as ProjectPriority
                  )
                : undefined,

            page,

            size,

            sortBy,

            direction,
          }),

      staleTime:
        20_000,
    });

  const deleteMutation =
    useMutation({
      mutationFn:
        deleteProjectApi,

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

          setProjectToDelete(
            null
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

  const handleFilterChange =
    (
      field:
        keyof ProjectFilterValues,

      value:
        string
    ) => {
      setDraftFilters(
        (
          previous
        ) => ({
          ...previous,

          [field]:
            value,
        })
      );
    };

  const handleSearch =
    () => {
      setPage(
        0
      );

      setAppliedFilters({
        ...draftFilters,
      });
    };

  const handleReset =
    () => {
      setDraftFilters({
        ...EMPTY_FILTERS,
      });

      setAppliedFilters({
        ...EMPTY_FILTERS,
      });

      setPage(
        0
      );

      setSize(
        10
      );

      setSortBy(
        "projectId"
      );

      setDirection(
        "asc"
      );
    };

    const handleOpenProject = (
  project:
    ProjectSearchResponse
) => {
  const path =
    ROUTES
      .PROJECT_MANAGER
      .PROJECT_DETAILS
      .replace(
        ":projectId",
        String(
          project.projectId
        )
      );

  navigate(path);
};
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
          (
            previous
          ) =>
            previous ===
            "asc"
              ? "desc"
              : "asc"
        );
      } else {
        setSortBy(
          field
        );

        setDirection(
          "asc"
        );
      }

      setPage(
        0
      );
    };

  const handleEdit =
    (
      project:
        ProjectSearchResponse
    ) => {
      const editPath =
        ROUTES
          .PROJECT_MANAGER
          .PROJECT_EDIT
          .replace(
            ":projectId",
            String(
              project.projectId
            )
          );

      navigate(
        editPath
      );
    };

  const handleDeleteConfirm =
    () => {
      if (
        !projectToDelete
      ) {
        return;
      }

      deleteMutation.mutate({
        projectId:
          projectToDelete
            .projectId,
      });
    };

  const projects =
    projectsQuery
      .data
      ?.content ??
    [];

  const totalElements =
    projectsQuery
      .data
      ?.totalElements ??
    0;

  return (
    <Box
      sx={{
        minHeight:
          "100%",

        mx: {
          xs:
            -2,

          sm:
            -2.5,

          md:
            -3,

          xl:
            -4,
        },

        my: {
          xs:
            -2,

          md:
            -3,
        },

        backgroundColor:
          "#EEF3F9",

        pb:
          5,
      }}
    >
      {/* ====================================================== */}
      {/* HERO HEADER */}
      {/* ====================================================== */}

      <Box
        sx={{
          position:
            "relative",

          overflow:
            "hidden",

          px: {
            xs:
              2,

            sm:
              3,

            md:
              4,
          },

          py: {
            xs:
              3,

            md:
              4,
          },

          color:
            "#FFFFFF",

          background:
            "linear-gradient(120deg, #102F5C 0%, #174E83 58%, #0B8CA5 100%)",

          "&::after":
            {
              content:
                '""',

              position:
                "absolute",

              width:
                310,

              height:
                310,

              right:
                -90,

              top:
                -170,

              borderRadius:
                "50%",

              border:
                "1px solid rgba(255,255,255,0.14)",
            },
        }}
      >
        <Box
          sx={{
            position:
              "relative",

            zIndex:
              1,

            display:
              "flex",

            flexDirection: {
              xs:
                "column",

              md:
                "row",
            },

            justifyContent:
              "space-between",

            alignItems: {
              xs:
                "flex-start",

              md:
                "center",
            },

            gap:
              2,
          }}
        >
          <Box>
            <Box
              sx={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  1,

                mb:
                  1,
              }}
            >
              <FolderOpenRounded
                sx={{
                  fontSize:
                    20,

                  color:
                    "#7FE3F0",
                }}
              />

              <Typography
                sx={{
                  fontSize:
                    "0.68rem",

                  fontWeight:
                    800,

                  letterSpacing:
                    "0.15em",

                  textTransform:
                    "uppercase",

                  color:
                    "rgba(255,255,255,0.65)",
                }}
              >
                Project Management
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: {
                  xs:
                    "1.8rem",

                  md:
                    "2.25rem",
                },

                fontWeight:
                  760,

                letterSpacing:
                  "-0.045em",
              }}
            >
              Project Workspace
            </Typography>

            <Typography
              sx={{
                mt:
                  0.8,

                maxWidth:
                  620,

                color:
                  "rgba(255,255,255,0.72)",

                fontSize:
                  "0.82rem",

                lineHeight:
                  1.65,
              }}
            >
              Organize projects, maintain schedules and prepare your planning
              data for CPM analysis.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={
              <AddRounded />
            }
            onClick={() =>
              navigate(
                ROUTES
                  .PROJECT_MANAGER
                  .PROJECT_CREATE
              )
            }
            sx={{
              px:
                2.5,

              py:
                1.15,

              backgroundColor:
                "#FFFFFF",

              color:
                "#173B73",

              borderRadius:
                2.5,

              fontWeight:
                750,

              boxShadow:
                "0 10px 30px rgba(0,0,0,0.13)",

              "&:hover":
                {
                  backgroundColor:
                    "#F3F7FC",
                },
            }}
          >
            Create Project
          </Button>
        </Box>
      </Box>

      {/* ====================================================== */}
      {/* MAIN CONTENT */}
      {/* ====================================================== */}

      <Box
        sx={{
          px: {
            xs:
              2,

            sm:
              3,

            md:
              4,
          },

          mt:
            -1.6,
        }}
      >
        {/* FILTER TOOLBAR */}

        <Paper
          elevation={0}
          sx={{
            position:
              "relative",

            zIndex:
              2,

            p: {
              xs:
                2,

              md:
                2.5,
            },

            borderRadius:
              3.5,

            border:
              "1px solid rgba(25,57,92,0.08)",

            boxShadow:
              "0 18px 45px rgba(23,54,90,0.10)",
          }}
        >
          <Box
            sx={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                1,

              mb:
                2,
            }}
          >
            <Box
              sx={{
                width:
                  34,

                height:
                  34,

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                borderRadius:
                  2,

                backgroundColor:
                  "#EAF1FA",

                color:
                  "#173B73",
              }}
            >
              <SearchRounded
                sx={{
                  fontSize:
                    18,
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize:
                    "0.88rem",

                  fontWeight:
                    720,
                }}
              >
                Find a project
              </Typography>

              <Typography
                sx={{
                  color:
                    "text.secondary",

                  fontSize:
                    "0.69rem",
                }}
              >
                Search using project details or filters.
              </Typography>
            </Box>
          </Box>

          <ProjectFilters
            values={
              draftFilters
            }
            loading={
              projectsQuery
                .isFetching
            }
            onChange={
              handleFilterChange
            }
            onSearch={
              handleSearch
            }
            onReset={
              handleReset
            }
          />
        </Paper>

        {/* PROJECT LIST HEADER */}

        <Box
          sx={{
            mt:
              3,

            mb:
              1.5,

            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            flexWrap:
              "wrap",

            gap:
              1.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize:
                  "1rem",

                fontWeight:
                  750,
              }}
            >
              Projects
            </Typography>

            <Box
              sx={{
                mt:
                  0.4,

                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  0.8,
              }}
            >
              <Typography
                sx={{
                  color:
                    "text.secondary",

                  fontSize:
                    "0.72rem",
                }}
              >
                Projects available in your workspace
              </Typography>

              <Chip
                label={
                  totalElements
                }
                size="small"
                sx={{
                  height:
                    22,

                  fontSize:
                    "0.66rem",

                  fontWeight:
                    750,

                  backgroundColor:
                    "#DDEAF8",

                  color:
                    "#173B73",
                }}
              />
            </Box>
          </Box>

          <Button
            size="small"
            startIcon={
              <RefreshRounded />
            }
            disabled={
              projectsQuery
                .isFetching
            }
            onClick={() =>
              projectsQuery.refetch()
            }
            sx={{
              color:
                "#173B73",

              fontWeight:
                700,
            }}
          >
            Refresh Data
          </Button>
        </Box>

        {projectsQuery.isError && (
          <Paper
            elevation={0}
            sx={{
              p:
                4,

              textAlign:
                "center",

              borderRadius:
                3,

              border:
                "1px solid #FFD7D7",
            }}
          >
            <Typography
              color="error"
              sx={{
                fontWeight:
                  700,
              }}
            >
              Unable to load projects.
            </Typography>

            <Button
              sx={{
                mt:
                  2,
              }}
              onClick={() =>
                projectsQuery.refetch()
              }
            >
              Try Again
            </Button>
          </Paper>
        )}

        {!projectsQuery.isError && (
          <ProjectTable
            projects={
              projects
            }
            page={
              page
            }
            size={
              size
            }
            totalElements={
              totalElements
            }
            sortBy={
              sortBy
            }
            direction={
              direction
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
            onSort={
              handleSort
            }
                     onView={
  handleOpenProject
}
            onEdit={
              handleEdit
            }
            onDelete={(
              project
            ) =>
              setProjectToDelete(
                project
              )
            }

   
          />
        )}
      </Box>

      <ProjectDetailsDialog
        projectId={
          selectedProjectId
        }
        open={
          selectedProjectId !==
          null
        }
        onClose={() =>
          setSelectedProjectId(
            null
          )
        }
      />

      <DeleteProjectDialog
        project={
          projectToDelete
        }
        open={
          projectToDelete !==
          null
        }
        loading={
          deleteMutation
            .isPending
        }
        onClose={() =>
          setProjectToDelete(
            null
          )
        }
        onConfirm={
          handleDeleteConfirm
        }
      />
    </Box>
  );
}