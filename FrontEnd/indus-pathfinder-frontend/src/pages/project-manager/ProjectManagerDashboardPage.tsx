import {
  AccountTreeOutlined,
  AddRounded,
  AnalyticsOutlined,
  ChecklistRounded,
  DescriptionOutlined,
  FolderOpenOutlined,
  RefreshRounded,
  ShareOutlined,
  TimelineOutlined,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Typography,
} from "@mui/material";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../auth/useAuth";

import {
  getProjectManagerDashboardApi,
} from "../../api/dashboard.api";

import {
  ROUTES,
} from "../../config/routes.config";

import StatCard
  from "../../components/cards/StatCard";

import DashboardWelcome
  from "../../components/dashboard/DashboardWelcome";

import QuickActionCard
  from "../../components/dashboard/QuickActionCard";

import PageLoader
  from "../../components/feedback/PageLoader";

import ErrorState
  from "../../components/feedback/ErrorState";
  

export default function ProjectManagerDashboardPage() {



  const {
    user,
  } = useAuth();

  const navigate =
    useNavigate();

  const userId =
    user?.userId ?? 0;

  const dashboardQuery =
    useQuery({
      queryKey: [
        "project-manager-dashboard",
        userId,
      ],

      queryFn: () =>
        getProjectManagerDashboardApi(
          userId
        ),

      enabled:
        userId > 0,

      staleTime:
        30_000,
    });

  const displayName =
    user?.firstName ||
    user?.userName ||
    "Project Manager";

  /*
   * Open project list and tell it
   * which project action the user
   * wants to perform.
   */
  const navigateToProjectAction = (
    action:
      | "cpm"
      | "float"
      | "network"
      | "reports"
  ) => {
    navigate(
      `${ROUTES.PROJECT_MANAGER.PROJECTS}?action=${action}`
    );
  };

  if (userId <= 0) {
    return null;
  }

  if (dashboardQuery.isLoading) {
    return (
      <PageLoader />
    );
  }

  if (dashboardQuery.isError) {
    return (
      <ErrorState
        title="Dashboard unavailable"
        message="Unable to load your project dashboard."
        action={
          <Button
            variant="outlined"
            startIcon={
              <RefreshRounded />
            }
            onClick={() =>
              dashboardQuery.refetch()
            }
          >
            Try Again
          </Button>
        }
      />
    );
  }

  const dashboard =
    dashboardQuery.data;

  return (
    <Box>
      {/* ======================================== */}
      {/* WELCOME */}
      {/* ======================================== */}

      <DashboardWelcome
        name={
          displayName
        }
      />

      {/* ======================================== */}
      {/* PORTFOLIO OVERVIEW */}
      {/* ======================================== */}

      <Box
        sx={{
          mt: 3,
          mb: 1.7,

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",
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
            Portfolio Overview
          </Typography>

          <Typography
            sx={{
              mt: 0.35,

              color:
                "text.secondary",

              fontSize:
                "0.75rem",
            }}
          >
            Current totals across
            your assigned project
            workspace.
          </Typography>
        </Box>

        <Button
          size="small"
          startIcon={
            <RefreshRounded />
          }
          disabled={
            dashboardQuery
              .isFetching
          }
          onClick={() =>
            dashboardQuery.refetch()
          }
        >
          Refresh
        </Button>
      </Box>

      {/* ======================================== */}
      {/* STAT CARDS */}
      {/* ======================================== */}

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
              "repeat(3, minmax(0, 1fr))",
          },

          gap: 2.5,
        }}
      >
        <StatCard
          title="Total Projects"
          value={
            dashboard
              ?.totalProjects ??
            0
          }
          subtitle="Projects in your workspace"
          icon={
            <FolderOpenOutlined />
          }
        />

        <StatCard
          title="Total Activities"
          value={
            dashboard
              ?.totalActivities ??
            0
          }
          subtitle="Activities across your projects"
          icon={
            <ChecklistRounded />
          }
        />

        <StatCard
          title="Total Dependencies"
          value={
            dashboard
              ?.totalDependencies ??
            0
          }
          subtitle="Defined activity relationships"
          icon={
            <AccountTreeOutlined />
          }
        />
      </Box>

      {/* ======================================== */}
      {/* QUICK ACTIONS */}
      {/* ======================================== */}

      <Box
        sx={{
          mt: 4,
          mb: 1.7,
        }}
      >
        <Typography
          sx={{
            fontSize:
              "1rem",

            fontWeight:
              750,
          }}
        >
          Quick Actions
        </Typography>

        <Typography
          sx={{
            mt: 0.35,

            color:
              "text.secondary",

            fontSize:
              "0.75rem",
          }}
        >
          Quickly access common project
          planning and analysis tasks.
        </Typography>
      </Box>

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
              "repeat(3, minmax(0, 1fr))",
          },

          gap: 2,
        }}
      >
        {/* MANAGE PROJECTS */}

        <QuickActionCard
          title="Manage Projects"
          description="Create, view and manage projects in your workspace."
          icon={
            <AddRounded />
          }
          onClick={() =>
            navigate(
              ROUTES
                .PROJECT_MANAGER
                .PROJECTS
            )
          }
        />

        {/* CPM */}

        <QuickActionCard
          title="Run CPM Analysis"
          description="Select a project and calculate EST, EFT, LST, LFT and critical activities."
          icon={
            <AnalyticsOutlined />
          }
          onClick={() =>
            navigateToProjectAction(
              "cpm"
            )
          }
        />

        {/* FLOAT */}

        <QuickActionCard
          title="Float Analysis"
          description="Select a project and analyze total, free and independent float."
          icon={
            <TimelineOutlined />
          }
          onClick={() =>
            navigateToProjectAction(
              "float"
            )
          }
        />

        {/* NETWORK */}

        <QuickActionCard
          title="Network Diagram"
          description="Select a project and visualize activity dependencies and critical paths."
          icon={
            <ShareOutlined />
          }
          onClick={() =>
            navigateToProjectAction(
              "network"
            )
          }
        />

        {/* REPORT */}

        <QuickActionCard
          title="Generate Report"
          description="Select a project and generate Project, Activity, Dependency, CPM or Float reports."
          icon={
            <DescriptionOutlined />
          }
          onClick={() =>
            navigateToProjectAction(
              "reports"
            )
          }
        />
      </Box>
    </Box>
  );
}