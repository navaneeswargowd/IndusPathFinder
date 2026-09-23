import type {
    ReactNode,
  } from "react";
  
  import {
    Box,
    Typography,
  } from "@mui/material";
  
  interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
  }
  
  export default function PageHeader({
    title,
    description,
    actions,
  }: PageHeaderProps) {
    return (
      <Box
        sx={{
          display: "flex",
  
          flexDirection: {
            xs: "column",
            md: "row",
          },
  
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
  
          justifyContent:
            "space-between",
  
          gap: 2,
  
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </Typography>
  
          {description && (
            <Typography
              sx={{
                mt: 0.65,
  
                color: "text.secondary",
  
                fontSize: "0.86rem",
              }}
            >
              {description}
            </Typography>
          )}
        </Box>
  
        {actions && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            {actions}
          </Box>
        )}
      </Box>
    );
  }