import {
    Box,
    CircularProgress,
    Typography,
  } from "@mui/material";
  
  interface PageLoaderProps {
    message?: string;
  }
  
  export default function PageLoader({
    message = "Loading...",
  }: PageLoaderProps) {
    return (
      <Box
        sx={{
          minHeight: 350,
  
          display: "flex",
          flexDirection: "column",
  
          alignItems: "center",
          justifyContent: "center",
  
          gap: 2,
        }}
      >
        <CircularProgress size={36} />
  
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: "0.85rem",
          }}
        >
          {message}
        </Typography>
      </Box>
    );
  }