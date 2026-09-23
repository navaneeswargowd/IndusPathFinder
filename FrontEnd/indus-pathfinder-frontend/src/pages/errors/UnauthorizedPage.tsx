import {
  Box,
  Button,
  Typography,
} from "@mui/material";

import {
  BlockOutlined,
} from "@mui/icons-material";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../auth/useAuth";

import {
  UserRole,
} from "../../enums/role.enum";

import {
  ROUTES,
} from "../../config/routes.config";

export default function UnauthorizedPage() {
  const navigate =
    useNavigate();

  const {
    role,
  } = useAuth();

  const goToDashboard =
    () => {
      if (
        role === UserRole.ADMIN
      ) {
        navigate(
          ROUTES.ADMIN
            .DASHBOARD
        );

        return;
      }

      navigate(
        ROUTES
          .PROJECT_MANAGER
          .DASHBOARD
      );
    };

  return (
    <Box
      sx={{
        minHeight: "70vh",

        display: "flex",
        flexDirection: "column",

        alignItems: "center",
        justifyContent: "center",

        textAlign: "center",
      }}
    >
      <BlockOutlined
        color="error"
        sx={{
          fontSize: 64,
        }}
      />

      <Typography
        variant="h4"
        sx={{ mt: 2 }}
      >
        Access restricted
      </Typography>

      <Typography
        sx={{
          mt: 1,
          maxWidth: 450,
          color:
            "text.secondary",
        }}
      >
        Your account does not have
        permission to access this
        module.
      </Typography>

      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={
          goToDashboard
        }
      >
        Return to Dashboard
      </Button>
    </Box>
  );
}