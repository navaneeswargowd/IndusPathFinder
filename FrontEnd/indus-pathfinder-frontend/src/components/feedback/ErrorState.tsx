import type {
    ReactNode,
  } from "react";
  
  import {
    ErrorOutlineRounded,
  } from "@mui/icons-material";
  
  import {
    Box,
    Typography,
  } from "@mui/material";
  
  interface ErrorStateProps {
    title?: string;
    message?: string;
    action?: ReactNode;
  }
  
  export default function ErrorState({
    title = "Something went wrong",
    message =
      "Unable to load the requested information.",
    action,
  }: ErrorStateProps) {
    return (
      <Box
        sx={{
          py: 6,
          px: 3,
          textAlign: "center",
        }}
      >
        <ErrorOutlineRounded
          color="error"
          sx={{
            fontSize: 44,
          }}
        />
  
        <Typography
          sx={{
            mt: 1.5,
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>
  
        <Typography
          sx={{
            mt: 0.7,
  
            color: "text.secondary",
  
            fontSize: "0.84rem",
          }}
        >
          {message}
        </Typography>
  
        {action && (
          <Box sx={{ mt: 2.5 }}>
            {action}
          </Box>
        )}
      </Box>
    );
  }