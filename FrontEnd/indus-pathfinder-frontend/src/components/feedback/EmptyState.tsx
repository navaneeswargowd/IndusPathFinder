import type {
    ReactNode,
  } from "react";
  
  import {
    Box,
    Typography,
  } from "@mui/material";
  
  import {
    InboxOutlined,
  } from "@mui/icons-material";
  
  interface EmptyStateProps {
    title?: string;
    description?: string;
    action?: ReactNode;
  }
  
  export default function EmptyState({
    title = "No records found",
    description =
      "There is currently no information available.",
    action,
  }: EmptyStateProps) {
    return (
      <Box
        sx={{
          py: 7,
          px: 3,
  
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
  
            mx: "auto",
            mb: 2,
  
            borderRadius: 4,
  
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
  
            color: "primary.main",
  
            backgroundColor:
              "rgba(23,59,115,0.06)",
          }}
        >
          <InboxOutlined
            sx={{ fontSize: 30 }}
          />
        </Box>
  
        <Typography
          sx={{
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>
  
        <Typography
          sx={{
            mt: 0.7,
  
            maxWidth: 420,
  
            mx: "auto",
  
            color: "text.secondary",
  
            fontSize: "0.84rem",
          }}
        >
          {description}
        </Typography>
  
        {action && (
          <Box sx={{ mt: 2.5 }}>
            {action}
          </Box>
        )}
      </Box>
    );
  }