import {
  ApartmentOutlined,
  FolderOpenOutlined,
  RefreshRounded,
  SecurityOutlined,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  useAuth,
} from "../../auth/useAuth";

import {
  getAdminDashboardApi,
} from "../../api/dashboard.api";

import StatCard from "../../components/cards/StatCard";

import DashboardWelcome from "../../components/dashboard/DashboardWelcome";

import PageLoader from "../../components/feedback/PageLoader";

import ErrorState from "../../components/feedback/ErrorState";

export default function AdminDashboardPage() {
  const {
    user,
  } = useAuth();

  const dashboardQuery =
    useQuery({
      queryKey: [
        "admin-dashboard",
      ],

      queryFn:
        getAdminDashboardApi,

      staleTime:
        30_000,
    });

  const displayName =
    user?.firstName ||
    user?.userName ||
    "Administrator";

  if (
    dashboardQuery.isLoading
  ) {
    return (
      <PageLoader
        message="Loading administrator dashboard..."
      />
    );
  }

  if (
    dashboardQuery.isError
  ) {
    return (
      <ErrorState
        title="Dashboard unavailable"
        message="Unable to load administrator dashboard information."
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
      <DashboardWelcome
        name={displayName}
        roleLabel="Administrator"
        description="Monitor platform-wide organization and project activity from one central workspace."
      />

      <Box
        sx={{
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
            Platform Overview
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
            IndusPathFinder.
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

      <Box
        sx={{
          display:
            "grid",

          gridTemplateColumns: {
            xs: "1fr",

            sm:
              "repeat(2, minmax(0, 1fr))",
          },

          gap: 2.5,
        }}
      >
        <StatCard
          title="Total Organizations"
          value={
            dashboard
              ?.totalOrganizations ??
            0
          }
          subtitle="Organizations registered on the platform"
          icon={
            <ApartmentOutlined />
          }
        />

        <StatCard
          title="Total Projects"
          value={
            dashboard
              ?.totalProjects ??
            0
          }
          subtitle="Projects across all organizations"
          icon={
            <FolderOpenOutlined />
          }
        />
      </Box>

      <Paper
        elevation={0}
        sx={{
          mt: 3,

          p: {
            xs: 2.3,
            md: 2.8,
          },

          display:
            "flex",

          alignItems:
            "center",

          gap: 2,

          border:
            "1px solid",

          borderColor:
            "divider",

          borderRadius:
            3,
        }}
      >
        <Box
          sx={{
            width: 48,

            height: 48,

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            flexShrink: 0,

            borderRadius:
              3,

            color:
              "primary.main",

            backgroundColor:
              "rgba(23,59,115,0.06)",
          }}
        >
          <SecurityOutlined />
        </Box>

        <Box>
          <Typography
            sx={{
              fontWeight:
                700,

              fontSize:
                "0.88rem",
            }}
          >
            Governance Workspace
          </Typography>

          <Typography
            sx={{
              mt: 0.45,

              color:
                "text.secondary",

              fontSize:
                "0.76rem",

              lineHeight:
                1.6,
            }}
          >
            Administrator access is
            focused on platform
            governance, monitoring and
            audit visibility.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}