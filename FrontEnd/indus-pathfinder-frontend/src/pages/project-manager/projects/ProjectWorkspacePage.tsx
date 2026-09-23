// import {
//   DeleteOutlineRounded,
//   EditOutlined,
//   PlayArrowRounded,
//   RefreshRounded,
// } from "@mui/icons-material";

// import {
//   Box,
//   Button,
//   Chip,
//   Paper,
//   Tab,
//   Tabs,
//   Typography,
// } from "@mui/material";

// import {
//   useQuery,
// } from "@tanstack/react-query";

// import {
//   useNavigate,
//   useParams,
//   useSearchParams,
// } from "react-router-dom";

// import {
//   getProjectDetailsApi,
// } from "../../../api/project.api";

// import {
//   ROUTES,
// } from "../../../config/routes.config";

// import PageLoader from "../../../components/feedback/PageLoader";
// import ErrorState from "../../../components/feedback/ErrorState";
// import ActivitiesTab
//   from "../../../components/activities/ActivitiesTab";
// import DependenciesTab
//   from "../../../components/dependencies/DependenciesTab";
// import CPMAnalysisTab
//   from "../../../components/cpm/CPMAnalysisTab";

// import FloatAnalysisTab
//   from "../../../components/float/FloatAnalysisTab";
// import NetworkDiagramTab
//   from "../../../components/network/NetworkDiagramTab";
// import ReportsTab
//   from "../../../components/reports/ReportsTab";
// type ProjectTab =
//   | "overview"
//   | "activities"
//   | "dependencies"
//   | "cpm"
//   | "float"
//   | "network"
//   | "reports";

// export default function ProjectWorkspacePage() {
//   const {
//     projectId,
//   } =
//     useParams<{
//       projectId:
//         string;
//     }>();

//   const [
//     searchParams,
//     setSearchParams,
//   ] =
//     useSearchParams();

//   const navigate =
//     useNavigate();

//   const numericProjectId =
//     Number(
//       projectId
//     );

//   const activeTab =
//     (
//       searchParams.get(
//         "tab"
//       ) ??
//       "overview"
//     ) as ProjectTab;

//   const query =
//     useQuery({
//       queryKey: [
//         "project-details",
//         numericProjectId,
//       ],

//       queryFn: () =>
//         getProjectDetailsApi({
//           projectId:
//             numericProjectId,
//         }),

//       enabled:
//         Number.isFinite(
//           numericProjectId
//         ) &&
//         numericProjectId >
//           0,
//     });

//   if (
//     query.isLoading
//   ) {
//     return (
//       <PageLoader
//         message="Loading project workspace..."
//       />
//     );
//   }

//   if (
//     query.isError ||
//     !query.data
//   ) {
//     return (
//       <ErrorState
//         title="Project unavailable"
//         message="Unable to load this project."
//       />
//     );
//   }

//   const project =
//     query.data;

//   const handleTabChange =
//     (
//       _:
//         React.SyntheticEvent,

//       value:
//         ProjectTab
//     ) => {
//       setSearchParams({
//         tab:
//           value,
//       });
//     };

//   const editPath =
//     ROUTES
//       .PROJECT_MANAGER
//       .PROJECT_EDIT
//       .replace(
//         ":projectId",
//         String(
//           project.projectId
//         )
//       );

//   return (
//     <Box>
//       {/* ================================================== */}
//       {/* PROJECT HEADER */}
//       {/* ================================================== */}

//       <Box
//         sx={{
//           mb:
//             2.5,

//           display:
//             "flex",

//           flexDirection: {
//             xs:
//               "column",

//             lg:
//               "row",
//           },

//           justifyContent:
//             "space-between",

//           alignItems: {
//             xs:
//               "flex-start",

//             lg:
//               "center",
//           },

//           gap:
//             2,
//         }}
//       >
//         <Box>
//           <Typography
//             sx={{
//               fontSize:
//                 "1.65rem",

//               fontWeight:
//                 760,

//               letterSpacing:
//                 "-0.035em",
//             }}
//           >
//             {
//               project.projectName
//             }
//           </Typography>

//           <Box
//             sx={{
//               mt:
//                 0.8,

//               display:
//                 "flex",

//               alignItems:
//                 "center",

//               flexWrap:
//                 "wrap",

//               gap:
//                 0.8,
//             }}
//           >
//             <Chip
//               label={
//                 project.projectCode
//               }
//               size="small"
//               sx={{
//                 fontWeight:
//                   700,

//                 backgroundColor:
//                   "#EEF2F6",
//               }}
//             />

//             <Chip
//               label={
//                 formatLabel(
//                   project.status
//                 )
//               }
//               size="small"
//               sx={{
//                 color:
//                   "#087A55",

//                 backgroundColor:
//                   "#E9F8F1",

//                 border:
//                   "1px solid #B9E8D3",
//               }}
//             />

//             <Chip
//               label={
//                 formatLabel(
//                   project.priority
//                 )
//               }
//               size="small"
//             />
//           </Box>
//         </Box>

//         <Box
//           sx={{
//             display:
//               "flex",

//             flexWrap:
//               "wrap",

//             gap:
//               1,
//           }}
//         >
//           <Button
//             variant="outlined"
//             startIcon={
//               <RefreshRounded />
//             }
//             onClick={() =>
//               query.refetch()
//             }
//           >
//             Refresh
//           </Button>

//           <Button
//             variant="outlined"
//             startIcon={
//               <EditOutlined />
//             }
//             onClick={() =>
//               navigate(
//                 editPath
//               )
//             }
//           >
//             Edit
//           </Button>

//           <Button
//             variant="outlined"
//             color="error"
//             startIcon={
//               <DeleteOutlineRounded />
//             }
//           >
//             Delete
//           </Button>

//           <Button
//             variant="contained"
//             startIcon={
//               <PlayArrowRounded />
//             }
//             onClick={() =>
//               setSearchParams({
//                 tab:
//                   "cpm",
//               })
//             }
//             sx={{
//               backgroundColor:
//                 "#078E91",

//               "&:hover":
//                 {
//                   backgroundColor:
//                     "#067A7D",
//                 },
//             }}
//           >
//             Run Analysis
//           </Button>
//         </Box>
//       </Box>

//       {/* ================================================== */}
//       {/* TABS */}
//       {/* ================================================== */}

//       <Paper
//         elevation={0}
//         sx={{
//           mb:
//             2.5,

//           border:
//             "1px solid",

//           borderColor:
//             "divider",

//           borderRadius:
//             0,

//           overflowX:
//             "auto",
//         }}
//       >
//         <Tabs
//           value={
//             activeTab
//           }
//           onChange={
//             handleTabChange
//           }
//           variant="scrollable"
//           scrollButtons="auto"
//           sx={{
//             minHeight:
//               52,

//             "& .MuiTab-root":
//               {
//                 minHeight:
//                   52,

//                 textTransform:
//                   "none",

//                 fontWeight:
//                   600,

//                 fontSize:
//                   "0.83rem",
//               },
//           }}
//         >
//           <Tab
//             label="Overview"
//             value="overview"
//           />

//           <Tab
//             label="Activities"
//             value="activities"
//           />

//           <Tab
//             label="Dependencies"
//             value="dependencies"
//           />

//           <Tab
//             label="CPM Analysis"
//             value="cpm"
//           />

//           <Tab
//             label="Float Analysis"
//             value="float"
//           />

//           <Tab
//             label="Network Diagram"
//             value="network"
//           />

//           <Tab
//             label="Reports"
//             value="reports"
//           />
//         </Tabs>
//       </Paper>

//       {/* ================================================== */}
//       {/* TAB CONTENT */}
//       {/* ================================================== */}

//       {activeTab ===
//         "overview" && (
//         <OverviewTab
//           project={
//             project
//           }
//         />
//       )}

//      {activeTab ===
//   "activities" && (
//   <ActivitiesTab
//     projectId={
//       project.projectId
//     }
//     projectStartDate={
//       project.startDate
//     }
//     projectEndDate={
//       project.endDate
//     }
//   />
// )}

//       {activeTab ===
//   "dependencies" && (
//   <DependenciesTab
//     projectId={
//       project.projectId
//     }
//   />
// )}

// {activeTab ===
//   "cpm" && (
//   <CPMAnalysisTab
//     projectId={
//       project.projectId
//     }
//   />
// )}

//     {activeTab ===
//   "float" && (
//   <FloatAnalysisTab
//     projectId={
//       project.projectId
//     }
//   />
// )}

//      {activeTab ===
//   "network" && (
//   <NetworkDiagramTab
//     projectId={
//       project.projectId
//     }
//   />
// )}

//      {activeTab ===
//   "reports" && (
//   <ReportsTab
//     projectId={
//       project.projectId
//     }
//     projectCode={
//       project.projectCode
//     }
//     projectName={
//       project.projectName
//     }
//   />
// )}
//     </Box>
//   );
// }

// function OverviewTab({
//   project,
// }: {
//   project: {
//     projectCode:
//       string;

//     projectName:
//       string;

//     description:
//       string;

//     startDate:
//       string;

//     endDate:
//       string;

//     status:
//       string;

//     priority:
//       string;
//   };
// }) {
//   return (
//     <Paper
//       elevation={0}
//       sx={{
//         p: {
//           xs:
//             2,

//           md:
//             3,
//         },

//         border:
//           "1px solid",

//         borderColor:
//           "divider",

//         borderRadius:
//           3,
//       }}
//     >
//       <Typography
//         sx={{
//           fontSize:
//             "1rem",

//           fontWeight:
//             700,
//         }}
//       >
//         Project Overview
//       </Typography>

//       <Box
//         sx={{
//           mt:
//             2.5,

//           display:
//             "grid",

//           gridTemplateColumns: {
//             xs:
//               "1fr",

//             sm:
//               "repeat(2, 1fr)",

//             lg:
//               "repeat(4, 1fr)",
//           },

//           gap:
//             2,
//         }}
//       >
//         <Detail
//           label="Project Code"
//           value={
//             project.projectCode
//           }
//         />

//         <Detail
//           label="Start Date"
//           value={
//             project.startDate
//           }
//         />

//         <Detail
//           label="End Date"
//           value={
//             project.endDate
//           }
//         />

//         <Detail
//           label="Priority"
//           value={
//             formatLabel(
//               project.priority
//             )
//           }
//         />
//       </Box>

//       <Box
//         sx={{
//           mt:
//             3,
//         }}
//       >
//         <Typography
//           sx={{
//             color:
//               "text.secondary",

//             fontSize:
//               "0.7rem",

//             fontWeight:
//               650,
//           }}
//         >
//           Description
//         </Typography>

//         <Typography
//           sx={{
//             mt:
//               0.7,

//             fontSize:
//               "0.85rem",

//             lineHeight:
//               1.75,
//           }}
//         >
//           {project.description ||
//             "No description provided."}
//         </Typography>
//       </Box>
//     </Paper>
//   );
// }

// function Detail({
//   label,
//   value,
// }: {
//   label:
//     string;

//   value:
//     string;
// }) {
//   return (
//     <Box
//       sx={{
//         p:
//           1.8,

//         borderRadius:
//           2.5,

//         backgroundColor:
//           "#F7F9FC",

//         border:
//           "1px solid #E7EDF4",
//       }}
//     >
//       <Typography
//         sx={{
//           color:
//             "text.secondary",

//           fontSize:
//             "0.68rem",
//         }}
//       >
//         {label}
//       </Typography>

//       <Typography
//         sx={{
//           mt:
//             0.5,

//           fontSize:
//             "0.84rem",

//           fontWeight:
//             700,
//         }}
//       >
//         {value}
//       </Typography>
//     </Box>
//   );
// }

// function ModulePlaceholder({
//   title,
//   description,
// }: {
//   title:
//     string;

//   description:
//     string;
// }) {
//   return (
//     <Paper
//       elevation={0}
//       sx={{
//         p:
//           4,

//         minHeight:
//           280,

//         display:
//           "flex",

//         flexDirection:
//           "column",

//         alignItems:
//           "center",

//         justifyContent:
//           "center",

//         textAlign:
//           "center",

//         border:
//           "1px solid",

//         borderColor:
//           "divider",

//         borderRadius:
//           3,
//       }}
//     >
//       <Typography
//         sx={{
//           fontSize:
//             "1rem",

//           fontWeight:
//             700,
//         }}
//       >
//         {title}
//       </Typography>

//       <Typography
//         sx={{
//           mt:
//             0.8,

//           maxWidth:
//             500,

//           color:
//             "text.secondary",

//           fontSize:
//             "0.8rem",
//         }}
//       >
//         {description}
//       </Typography>
//     </Paper>
//   );
// }

// function formatLabel(
//   value:
//     string
// ) {
//   return value
//     .toLowerCase()
//     .replace(
//       /_/g,
//       " "
//     )
//     .replace(
//       /\b\w/g,
//       (
//         letter
//       ) =>
//         letter.toUpperCase()
//     );
// }



import {
  DeleteOutlineRounded,
  EditOutlined,
  PlayArrowRounded,
  RefreshRounded,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Chip,
  Paper,
  Tab,
  Tabs,
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
  useSnackbar,
} from "notistack";

import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  deleteProjectApi,
  getProjectDetailsApi,
} from "../../../api/project.api";

import {
  ROUTES,
} from "../../../config/routes.config";

import {
  getErrorMessage,
} from "../../../utils/error.utils";

import type {
  ProjectSearchResponse,
} from "../../../types/project.types";

import PageLoader
  from "../../../components/feedback/PageLoader";

import ErrorState
  from "../../../components/feedback/ErrorState";

import ActivitiesTab
  from "../../../components/activities/ActivitiesTab";

import DependenciesTab
  from "../../../components/dependencies/DependenciesTab";

import CPMAnalysisTab
  from "../../../components/cpm/CPMAnalysisTab";

import FloatAnalysisTab
  from "../../../components/float/FloatAnalysisTab";

import NetworkDiagramTab
  from "../../../components/network/NetworkDiagramTab";

import ReportsTab
  from "../../../components/reports/ReportsTab";

import DeleteProjectDialog
  from "../../../components/projects/DeleteProjectDialog";


type ProjectTab =
  | "overview"
  | "activities"
  | "dependencies"
  | "cpm"
  | "float"
  | "network"
  | "reports";


export default function ProjectWorkspacePage() {

  const {
    projectId,
  } =
    useParams<{
      projectId:
        string;
    }>();


  const [
    searchParams,
    setSearchParams,
  ] =
    useSearchParams();


  const navigate =
    useNavigate();


  const {
    enqueueSnackbar,
  } =
    useSnackbar();


  const queryClient =
    useQueryClient();


  const numericProjectId =
    Number(
      projectId
    );


  const activeTab =
    (
      searchParams.get(
        "tab"
      ) ??
      "overview"
    ) as ProjectTab;


  /*
   * ==========================================================
   * DELETE PROJECT DIALOG STATE
   * ==========================================================
   */

  const [
    projectToDelete,
    setProjectToDelete,
  ] =
    useState<
      ProjectSearchResponse | null
    >(
      null
    );


  /*
   * ==========================================================
   * PROJECT DETAILS
   * ==========================================================
   */

  const query =
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


  /*
   * ==========================================================
   * DELETE PROJECT
   * ==========================================================
   */

  const deleteMutation =
    useMutation({
      mutationFn:
        deleteProjectApi,

      onSuccess:
        (
          response
        ) => {

          /*
           * Close delete dialog.
           */

          setProjectToDelete(
            null
          );


          /*
           * Show success message.
           */

          enqueueSnackbar(
            response.message ||
              "Project deleted successfully.",
            {
              variant:
                "success",
            }
          );


          /*
           * Refresh project list.
           */

          void queryClient.invalidateQueries({
            queryKey: [
              "projects",
            ],
          });


          /*
           * Refresh PM dashboard
           * because project count changed.
           */

          void queryClient.invalidateQueries({
            queryKey: [
              "project-manager-dashboard",
            ],
          });


          /*
           * Refresh notifications.
           */

          void queryClient.invalidateQueries({
            queryKey: [
              "header-notifications",
            ],
          });


          /*
           * Navigate back to Projects.
           */

          navigate(
            ROUTES
              .PROJECT_MANAGER
              .PROJECTS
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
   * ==========================================================
   * DELETE CONFIRM
   * ==========================================================
   */

  const handleDeleteConfirm =
    () => {

      if (
        !projectToDelete
      ) {
        return;
      }


      deleteMutation.mutate({
        projectId:
          projectToDelete.projectId,
      });
    };


  /*
   * ==========================================================
   * LOADING
   * ==========================================================
   */

  if (
    query.isLoading
  ) {
    return (
      <PageLoader
        message="Loading project workspace..."
      />
    );
  }


  /*
   * ==========================================================
   * ERROR
   * ==========================================================
   */

  if (
    query.isError ||
    !query.data
  ) {
    return (
      <ErrorState
        title="Project unavailable"
        message="Unable to load this project."
      />
    );
  }


  const project =
    query.data;


  /*
   * ==========================================================
   * TAB CHANGE
   * ==========================================================
   */

  const handleTabChange =
    (
      _:
        React.SyntheticEvent,

      value:
        ProjectTab
    ) => {

      setSearchParams({
        tab:
          value,
      });
    };


  /*
   * ==========================================================
   * EDIT PATH
   * ==========================================================
   */

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


  /*
   * ==========================================================
   * DELETE PROJECT OBJECT
   *
   * DeleteProjectDialog expects ProjectSearchResponse.
   *
   * We create the required object from the project details
   * response.
   * ==========================================================
   */

  const deleteProject =
    {
      projectId:
        project.projectId,

      projectCode:
        project.projectCode,

      projectName:
        project.projectName,

      description:
        project.description,

      startDate:
        project.startDate,

      endDate:
        project.endDate,

      status:
        project.status,

      priority:
        project.priority,
    } as ProjectSearchResponse;


  return (
    <Box>

      {/* ================================================== */}
      {/* PROJECT HEADER */}
      {/* ================================================== */}

      <Box
        sx={{
          mb:
            2.5,

          display:
            "flex",

          flexDirection: {
            xs:
              "column",

            lg:
              "row",
          },

          justifyContent:
            "space-between",

          alignItems: {
            xs:
              "flex-start",

            lg:
              "center",
          },

          gap:
            2,
        }}
      >

        <Box>

          <Typography
            sx={{
              fontSize:
                "1.65rem",

              fontWeight:
                760,

              letterSpacing:
                "-0.035em",
            }}
          >
            {
              project.projectName
            }
          </Typography>


          <Box
            sx={{
              mt:
                0.8,

              display:
                "flex",

              alignItems:
                "center",

              flexWrap:
                "wrap",

              gap:
                0.8,
            }}
          >

            <Chip
              label={
                project.projectCode
              }

              size="small"

              sx={{
                fontWeight:
                  700,

                backgroundColor:
                  "#EEF2F6",
              }}
            />


            <Chip
              label={
                formatLabel(
                  project.status
                )
              }

              size="small"

              sx={{
                color:
                  "#087A55",

                backgroundColor:
                  "#E9F8F1",

                border:
                  "1px solid #B9E8D3",
              }}
            />


            <Chip
              label={
                formatLabel(
                  project.priority
                )
              }

              size="small"
            />

          </Box>

        </Box>


        {/* ================================================== */}
        {/* ACTION BUTTONS */}
        {/* ================================================== */}

        <Box
          sx={{
            display:
              "flex",

            flexWrap:
              "wrap",

            gap:
              1,
          }}
        >

          {/* ================================================= */}
          {/* REFRESH */}
          {/* ================================================= */}

          <Button
            variant="outlined"

            startIcon={
              <RefreshRounded />
            }

            onClick={() =>
              query.refetch()
            }

            disabled={
              query.isFetching
            }
          >
            Refresh
          </Button>


          {/* ================================================= */}
          {/* EDIT */}
          {/* ================================================= */}

          <Button
            variant="outlined"

            startIcon={
              <EditOutlined />
            }

            onClick={() =>
              navigate(
                editPath
              )
            }

            disabled={
              deleteMutation.isPending
            }
          >
            Edit
          </Button>


          {/* ================================================= */}
          {/* DELETE */}
          {/* ================================================= */}

          <Button
            variant="outlined"

            color="error"

            startIcon={
              <DeleteOutlineRounded />
            }

            onClick={() =>
              setProjectToDelete(
                deleteProject
              )
            }

            disabled={
              deleteMutation.isPending
            }
          >
            Delete
          </Button>


          {/* ================================================= */}
          {/* RUN ANALYSIS */}
          {/* ================================================= */}

          <Button
            variant="contained"

            startIcon={
              <PlayArrowRounded />
            }

            onClick={() =>
              setSearchParams({
                tab:
                  "cpm",
              })
            }

            sx={{
              backgroundColor:
                "#078E91",

              "&:hover":
                {
                  backgroundColor:
                    "#067A7D",
                },
            }}

            disabled={
              deleteMutation.isPending
            }
          >
            Run Analysis
          </Button>

        </Box>

      </Box>


      {/* ================================================== */}
      {/* TABS */}
      {/* ================================================== */}

      <Paper
        elevation={0}

        sx={{
          mb:
            2.5,

          border:
            "1px solid",

          borderColor:
            "divider",

          borderRadius:
            0,

          overflowX:
            "auto",
        }}
      >

        <Tabs
          value={
            activeTab
          }

          onChange={
            handleTabChange
          }

          variant="scrollable"

          scrollButtons="auto"

          sx={{
            minHeight:
              52,

            "& .MuiTab-root":
              {
                minHeight:
                  52,

                textTransform:
                  "none",

                fontWeight:
                  600,

                fontSize:
                  "0.83rem",
              },
          }}
        >

          <Tab
            label="Overview"
            value="overview"
          />

          <Tab
            label="Activities"
            value="activities"
          />

          <Tab
            label="Dependencies"
            value="dependencies"
          />

          <Tab
            label="CPM Analysis"
            value="cpm"
          />

          <Tab
            label="Float Analysis"
            value="float"
          />

          <Tab
            label="Network Diagram"
            value="network"
          />

          <Tab
            label="Reports"
            value="reports"
          />

        </Tabs>

      </Paper>


      {/* ================================================== */}
      {/* TAB CONTENT */}
      {/* ================================================== */}

      {activeTab ===
        "overview" && (
        <OverviewTab
          project={
            project
          }
        />
      )}


      {activeTab ===
        "activities" && (
        <ActivitiesTab
          projectId={
            project.projectId
          }

          projectStartDate={
            project.startDate
          }

          projectEndDate={
            project.endDate
          }
        />
      )}


      {activeTab ===
        "dependencies" && (
        <DependenciesTab
          projectId={
            project.projectId
          }
        />
      )}


      {activeTab ===
        "cpm" && (
        <CPMAnalysisTab
          projectId={
            project.projectId
          }
        />
      )}


      {activeTab ===
        "float" && (
        <FloatAnalysisTab
          projectId={
            project.projectId
          }
        />
      )}


      {activeTab ===
        "network" && (
        <NetworkDiagramTab
          projectId={
            project.projectId
          }
        />
      )}


      {activeTab ===
        "reports" && (
        <ReportsTab
          projectId={
            project.projectId
          }

          projectCode={
            project.projectCode
          }

          projectName={
            project.projectName
          }
        />
      )}


      {/* ================================================== */}
      {/* DELETE PROJECT DIALOG */}
      {/* ================================================== */}

      <DeleteProjectDialog
        project={
          projectToDelete
        }

        open={
          projectToDelete !==
          null
        }

        loading={
          deleteMutation.isPending
        }

        onClose={() => {

          if (
            !deleteMutation.isPending
          ) {

            setProjectToDelete(
              null
            );
          }

        }}

        onConfirm={
          handleDeleteConfirm
        }
      />

    </Box>
  );
}


/*
 * ==========================================================
 * OVERVIEW TAB
 * ==========================================================
 */

function OverviewTab({
  project,
}: {
  project: {
    projectCode:
      string;

    projectName:
      string;

    description:
      string;

    startDate:
      string;

    endDate:
      string;

    status:
      string;

    priority:
      string;
  };
}) {

  return (
    <Paper
      elevation={0}

      sx={{
        p: {
          xs:
            2,

          md:
            3,
        },

        border:
          "1px solid",

        borderColor:
          "divider",

        borderRadius:
          3,
      }}
    >

      <Typography
        sx={{
          fontSize:
            "1rem",

          fontWeight:
            700,
        }}
      >
        Project Overview
      </Typography>


      <Box
        sx={{
          mt:
            2.5,

          display:
            "grid",

          gridTemplateColumns: {
            xs:
              "1fr",

            sm:
              "repeat(2, 1fr)",

            lg:
              "repeat(4, 1fr)",
          },

          gap:
            2,
        }}
      >

        <Detail
          label="Project Code"
          value={
            project.projectCode
          }
        />


        <Detail
          label="Start Date"
          value={
            project.startDate
          }
        />


        <Detail
          label="End Date"
          value={
            project.endDate
          }
        />


        <Detail
          label="Priority"
          value={
            formatLabel(
              project.priority
            )
          }
        />

      </Box>


      <Box
        sx={{
          mt:
            3,
        }}
      >

        <Typography
          sx={{
            color:
              "text.secondary",

            fontSize:
              "0.7rem",

            fontWeight:
              650,
          }}
        >
          Description
        </Typography>


        <Typography
          sx={{
            mt:
              0.7,

            fontSize:
              "0.85rem",

            lineHeight:
              1.75,
          }}
        >
          {
            project.description ||
            "No description provided."
          }
        </Typography>

      </Box>

    </Paper>
  );
}


/*
 * ==========================================================
 * DETAIL
 * ==========================================================
 */

function Detail({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {

  return (
    <Box
      sx={{
        p:
          1.8,

        borderRadius:
          2.5,

        backgroundColor:
          "#F7F9FC",

        border:
          "1px solid #E7EDF4",
      }}
    >

      <Typography
        sx={{
          color:
            "text.secondary",

          fontSize:
            "0.68rem",
        }}
      >
        {label}
      </Typography>


      <Typography
        sx={{
          mt:
            0.5,

          fontSize:
            "0.84rem",

          fontWeight:
            700,
        }}
      >
        {value}
      </Typography>

    </Box>
  );
}


/*
 * ==========================================================
 * MODULE PLACEHOLDER
 * ==========================================================
 */

function ModulePlaceholder({
  title,
  description,
}: {
  title:
    string;

  description:
    string;
}) {

  return (
    <Paper
      elevation={0}

      sx={{
        p:
          4,

        minHeight:
          280,

        display:
          "flex",

        flexDirection:
          "column",

        alignItems:
          "center",

        justifyContent:
          "center",

        textAlign:
          "center",

        border:
          "1px solid",

        borderColor:
          "divider",

        borderRadius:
          3,
      }}
    >

      <Typography
        sx={{
          fontSize:
            "1rem",

          fontWeight:
            700,
        }}
      >
        {title}
      </Typography>


      <Typography
        sx={{
          mt:
            0.8,

          maxWidth:
            500,

          color:
            "text.secondary",

          fontSize:
            "0.8rem",
        }}
      >
        {description}
      </Typography>

    </Paper>
  );
}


/*
 * ==========================================================
 * FORMAT LABEL
 * ==========================================================
 */

function formatLabel(
  value:
    string
) {

  return value
    .toLowerCase()
    .replace(
      /_/g,
      " "
    )
    .replace(
      /\b\w/g,
      (
        letter
      ) =>
        letter.toUpperCase()
    );
}
