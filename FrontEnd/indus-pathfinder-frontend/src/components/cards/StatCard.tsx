import type {
    ReactNode,
  } from "react";
  
  import {
    Box,
    Card,
    CardContent,
    Typography,
  } from "@mui/material";
  
  interface StatCardProps {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: ReactNode;
  }
  
  export default function StatCard({
    title,
    value,
    subtitle,
    icon,
  }: StatCardProps) {
    return (
      <Card
        sx={{
          height: "100%",
  
          position: "relative",
  
          overflow: "hidden",
  
          transition:
            "transform 180ms ease, box-shadow 180ms ease",
  
          "&:hover": {
            transform: "translateY(-3px)",
  
            boxShadow:
              "0 14px 38px rgba(27,51,89,0.10)",
          },
  
          "&::after": {
            content: '""',
  
            position: "absolute",
  
            top: -30,
            right: -30,
  
            width: 110,
            height: 110,
  
            borderRadius: "50%",
  
            background:
              "radial-gradient(circle, rgba(33,137,196,0.12), transparent 68%)",
          },
        }}
      >
        <CardContent
          sx={{
            p: 2.5,
  
            "&:last-child": {
              pb: 2.5,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent:
                "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "text.secondary",
  
                  fontSize: "0.79rem",
  
                  fontWeight: 600,
                }}
              >
                {title}
              </Typography>
  
              <Typography
                sx={{
                  mt: 0.7,
  
                  fontSize: "1.8rem",
  
                  fontWeight: 780,
  
                  letterSpacing: "-0.04em",
                }}
              >
                {value}
              </Typography>
  
              {subtitle && (
                <Typography
                  sx={{
                    mt: 0.7,
  
                    color:
                      "text.secondary",
  
                    fontSize: "0.74rem",
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
  
            <Box
              sx={{
                width: 46,
                height: 46,
  
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
  
                borderRadius: 3,
  
                color: "primary.main",
  
                background:
                  "linear-gradient(135deg, rgba(23,59,115,0.09), rgba(13,146,184,0.11))",
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }