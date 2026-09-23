import {
    AccountTreeRounded,
    AnalyticsRounded,
    RouteRounded,
    TimelineRounded,
  } from "@mui/icons-material";
  
  import {
    Box,
    Paper,
    Stack,
    Typography,
  } from "@mui/material";
  
  import {
    Outlet,
  } from "react-router-dom";
  
  import {
    APP_NAME,
    APP_TAGLINE,
  } from "../config/constants";
  
  export default function AuthLayout() {
    return (
      <Box
        sx={{
          minHeight: "100vh",
  
          display: "grid",
  
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1.2fr 0.8fr",
          },
  
          position: "relative",
  
          overflow: "hidden",
  
          background:
            "radial-gradient(circle at 15% 15%, rgba(25,121,190,0.35), transparent 35%), radial-gradient(circle at 78% 75%, rgba(13,146,184,0.22), transparent 34%), linear-gradient(135deg, #07182F 0%, #102E59 48%, #0A2040 100%)",
        }}
      >
        {/* Decorative project planning grid */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
  
            opacity: 0.18,
  
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
  
            backgroundSize: "52px 52px",
  
            pointerEvents: "none",
          }}
        />
  
        {/* Left project-suite branding panel */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
  
            display: {
              xs: "none",
              lg: "flex",
            },
  
            flexDirection: "column",
            justifyContent: "space-between",
  
            px: {
              lg: 7,
              xl: 10,
            },
  
            py: 7,
  
            color: "#FFFFFF",
          }}
        >
          <Box>
            <Box
              sx={{
                width: 56,
                height: 56,
  
                borderRadius: 4,
  
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
  
                background:
                  "linear-gradient(135deg, #328BD6, #10A9C4)",
  
                boxShadow:
                  "0 12px 32px rgba(15,169,196,0.28)",
  
                mb: 3,
              }}
            >
              <AccountTreeRounded
                sx={{
                  fontSize: 30,
                }}
              />
            </Box>
  
            <Typography
              sx={{
                fontSize: "0.8rem",
                color:
                  "rgba(255,255,255,0.58)",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              Enterprise Project Intelligence
            </Typography>
  
            <Typography
              sx={{
                maxWidth: 680,
  
                fontSize: {
                  lg: "2.6rem",
                  xl: "3.35rem",
                },
  
                lineHeight: 1.08,
                fontWeight: 780,
                letterSpacing: "-0.05em",
              }}
            >
              Turn complex schedules into
              clear project decisions.
            </Typography>
  
            <Typography
              sx={{
                maxWidth: 580,
                mt: 2.2,
  
                fontSize: "1rem",
  
                lineHeight: 1.8,
  
                color:
                  "rgba(255,255,255,0.7)",
              }}
            >
              Plan activities, define
              dependencies, identify critical
              paths and transform project
              schedules into actionable
              intelligence.
            </Typography>
          </Box>
  
          <Stack
            direction="row"
            spacing={2}
          >
            <Feature
              icon={<TimelineRounded />}
              title="Schedule"
            />
  
            <Feature
              icon={<RouteRounded />}
              title="Critical Path"
            />
  
            <Feature
              icon={<AnalyticsRounded />}
              title="Analysis"
            />
          </Stack>
        </Box>
  
        {/* Right auth area */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
  
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
  
            p: {
              xs: 2,
              sm: 4,
              lg: 5,
            },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 850,
  
              p: {
                xs: 3,
                sm: 4.5,
              },
  
              backgroundColor:
                "rgba(255,255,255,0.96)",
  
              backdropFilter:
                "blur(22px)",
  
              boxShadow:
                "0 30px 80px rgba(0,0,0,0.22)",
  
              border:
                "1px solid rgba(255,255,255,0.62)",
            }}
          >
            <Box
              sx={{
                display: {
                  xs: "block",
                  lg: "none",
                },
  
                mb: 3,
              }}
            >
              <Typography
                variant="h5"
                color="primary"
              >
                {APP_NAME}
              </Typography>
  
              <Typography
                sx={{
                  mt: 0.5,
                  color: "text.secondary",
                  fontSize: "0.75rem",
                }}
              >
                {APP_TAGLINE}
              </Typography>
            </Box>
  
            <Outlet />
          </Paper>
        </Box>
      </Box>
    );
  }
  
  interface FeatureProps {
    icon: React.ReactNode;
    title: string;
  }
  
  function Feature({
    icon,
    title,
  }: FeatureProps) {
    return (
      <Box
        sx={{
          minWidth: 150,
  
          display: "flex",
          alignItems: "center",
  
          gap: 1.2,
  
          px: 2,
          py: 1.5,
  
          borderRadius: 3,
  
          border:
            "1px solid rgba(255,255,255,0.12)",
  
          backgroundColor:
            "rgba(255,255,255,0.055)",
  
          backdropFilter: "blur(12px)",
        }}
      >
        <Box
          sx={{
            color: "#67D2E7",
            display: "flex",
          }}
        >
          {icon}
        </Box>
  
        <Typography
          sx={{
            fontSize: "0.82rem",
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>
      </Box>
    );
  }