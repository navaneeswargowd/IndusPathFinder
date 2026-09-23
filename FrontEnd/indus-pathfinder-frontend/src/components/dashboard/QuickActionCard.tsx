import type {
  ReactNode,
} from "react";

import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

import {
  ArrowForwardRounded,
} from "@mui/icons-material";

interface QuickActionCardProps {
  title: string;

  description: string;

  icon: ReactNode;

  onClick?: () => void;

  disabled?: boolean;

  comingSoon?: boolean;
}

export default function QuickActionCard({
  title,
  description,
  icon,
  onClick,
  disabled = false,
  comingSoon = false,
}: QuickActionCardProps) {
  const clickable =
    !disabled &&
    Boolean(onClick);

  return (
    <Paper
      elevation={0}
      onClick={
        clickable
          ? onClick
          : undefined
      }
      sx={{
        position:
          "relative",

        height:
          "100%",

        p: 2.3,

        border:
          "1px solid",

        borderColor:
          "divider",

        borderRadius:
          3,

        cursor:
          clickable
            ? "pointer"
            : "default",

        opacity:
          disabled
            ? 0.65
            : 1,

        transition:
          "transform 170ms ease, box-shadow 170ms ease, border-color 170ms ease",

        "&:hover":
          clickable
            ? {
                transform:
                  "translateY(-3px)",

                borderColor:
                  "rgba(23,59,115,0.18)",

                boxShadow:
                  "0 12px 35px rgba(28,52,87,0.09)",
              }
            : {},
      }}
    >
      <Box
        sx={{
          display:
            "flex",

          justifyContent:
            "space-between",

          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 44,

            height: 44,

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            flexShrink: 0,

            borderRadius:
              2.5,

            color:
              "primary.main",

            background:
              "linear-gradient(135deg, rgba(23,59,115,0.08), rgba(13,146,184,0.12))",
          }}
        >
          {icon}
        </Box>

        {clickable && (
          <ArrowForwardRounded
            sx={{
              fontSize:
                19,

              color:
                "text.disabled",
            }}
          />
        )}
      </Box>

      <Typography
        sx={{
          mt: 2,

          fontWeight:
            700,

          fontSize:
            "0.9rem",
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          mt: 0.5,

          color:
            "text.secondary",

          fontSize:
            "0.76rem",

          lineHeight:
            1.55,
        }}
      >
        {description}
      </Typography>

      {comingSoon && (
        <Typography
          sx={{
            mt: 1.3,

            display:
              "inline-block",

            px: 1,
            py: 0.4,

            borderRadius:
              1.5,

            backgroundColor:
              "rgba(23,59,115,0.06)",

            color:
              "text.secondary",

            fontSize:
              "0.65rem",

            fontWeight:
              650,
          }}
        >
          Available in upcoming phase
        </Typography>
      )}
    </Paper>
  );
}