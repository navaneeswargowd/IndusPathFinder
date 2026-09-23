import {
  Box,
  Typography,
} from "@mui/material";

import {
  WavingHandRounded,
} from "@mui/icons-material";

interface DashboardWelcomeProps {
  name: string;

  roleLabel?: string;

  description?: string;
}

export default function DashboardWelcome({
  name,
  roleLabel,
  description,
}: DashboardWelcomeProps) {
  return (
    <Box
      sx={{
        mb: 3,

        px: {
          xs: 2.5,
          md: 3.5,
        },

        py: {
          xs: 2.5,
          md: 3,
        },

        borderRadius: 3,

        border:
          "1px solid",

        borderColor:
          "divider",

        background:
          "linear-gradient(135deg, #F8FAFC 0%, #EEF7F8 100%)",

        boxShadow:
          "0 8px 28px rgba(15, 23, 42, 0.04)",
      }}
    >
      <Box
        sx={{
          display: "flex",

          alignItems: "center",

          gap: 1,
        }}
      >
        <WavingHandRounded
          sx={{
            fontSize: 24,

            color:
              "primary.main",
          }}
        />

        <Typography
          sx={{
            fontSize: {
              xs: "1.2rem",
              md: "1.5rem",
            },

            fontWeight: 750,

            color:
              "text.primary",
          }}
        >
          Welcome back, {name}
        </Typography>
      </Box>

      {description && (
        <Typography
          sx={{
            mt: 0.8,

            maxWidth: 700,

            color:
              "text.secondary",

            fontSize: "0.82rem",

            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      )}

      {roleLabel && (
        <Box
          sx={{
            mt: 1.5,

            display:
              "inline-flex",

            alignItems:
              "center",

            px: 1.3,

            py: 0.5,

            borderRadius: 10,

            backgroundColor:
              "rgba(7, 142, 145, 0.08)",

            border:
              "1px solid rgba(7, 142, 145, 0.15)",
          }}
        >
          <Typography
            sx={{
              fontSize:
                "0.68rem",

              fontWeight: 700,

              color:
                "#078E91",

              letterSpacing:
                "0.03em",
            }}
          >
            {roleLabel}
          </Typography>
        </Box>
      )}
    </Box>
  );
}