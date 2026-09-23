import {
  AccountTreeRounded,
  AnalyticsRounded,
  ArrowForwardRounded,
  CheckCircleRounded,
  DashboardRounded,
  LoginRounded,
  TimelineRounded,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import {
  Link,
} from "react-router-dom";

import {
  ROUTES,
} from "../../config/routes.config";


export default function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #F7FAFC 0%, #FFFFFF 100%)",
      }}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Box
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Container maxWidth="lg">

          <Box
            sx={{
              minHeight: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >

            {/* LOGO */}

            <Box>
              <Typography
                sx={{
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "primary.main",
                }}
              >
                IndusPathFinder
              </Typography>

              <Typography
                sx={{
                  mt: 0.2,
                  fontSize: "0.68rem",
                  color: "text.secondary",
                }}
              >
                Project Scheduling & CPM Analysis
              </Typography>
            </Box>


            {/* HEADER ACTIONS */}

            <Stack
              direction="row"
              spacing={1}
            >
              <Button
                component={Link}
                to={ROUTES.LOGIN}
                variant="outlined"
                size="small"
                startIcon={
                  <LoginRounded />
                }
              >
                Sign In
              </Button>

              <Button
                component={Link}
                to={ROUTES.REGISTER}
                variant="contained"
                size="small"
                endIcon={
                  <ArrowForwardRounded />
                }
              >
                Register
              </Button>
            </Stack>

          </Box>

        </Container>
      </Box>


      {/* =====================================================
          HERO
      ===================================================== */}

      <Container maxWidth="lg">

        <Box
          sx={{
            py: {
              xs: 7,
              md: 11,
            },
          }}
        >

          <Box
            sx={{
              maxWidth: 850,
              mx: "auto",
              textAlign: "center",
            }}
          >

            <Typography
              sx={{
                display: "inline-flex",
                px: 1.5,
                py: 0.7,
                borderRadius: 10,
                backgroundColor:
                  "rgba(23,59,115,0.07)",
                color: "primary.main",
                fontSize: "0.72rem",
                fontWeight: 750,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Intelligent Project Planning
            </Typography>


            <Typography
              variant="h1"
              sx={{
                mt: 2.5,
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 1.05,
                fontSize: {
                  xs: "2.5rem",
                  sm: "3.5rem",
                  md: "4.4rem",
                },
              }}
            >
              Plan smarter.
              <br />
              Schedule better.
              <br />
              Deliver with confidence.
            </Typography>


            <Typography
              sx={{
                maxWidth: 700,
                mx: "auto",
                mt: 2.5,
                color: "text.secondary",
                fontSize: {
                  xs: "0.92rem",
                  md: "1rem",
                },
                lineHeight: 1.8,
              }}
            >
              IndusPathFinder helps teams manage projects,
              activities, dependencies and schedules using
              Critical Path Method analysis and float analysis.
            </Typography>


            {/* <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.5}
              justifyContent="center"
              sx={{
                mt: 4,
              }}
            > */}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                mt: 4,
                justifyContent: "center",
              }}
            >

              <Button
                component={Link}
                to={ROUTES.REGISTER}
                variant="contained"
                size="large"
                endIcon={
                  <ArrowForwardRounded />
                }
                sx={{
                  px: 3.5,
                  py: 1.2,
                  borderRadius: 2,
                }}
              >
                Get Started
              </Button>


              <Button
                component={Link}
                to={ROUTES.LOGIN}
                variant="outlined"
                size="large"
                startIcon={
                  <LoginRounded />
                }
                sx={{
                  px: 3.5,
                  py: 1.2,
                  borderRadius: 2,
                }}
              >
                Sign In
              </Button>

            </Stack>

          </Box>

        </Box>


        {/* =====================================================
            FEATURES
        ===================================================== */}

        <Box
          sx={{
            pb: 10,
          }}
        >

          <Box
            sx={{
              textAlign: "center",
            }}
          >

            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 750,
                color: "secondary.main",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Core Capabilities
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mt: 0.8,
                fontWeight: 750,
                letterSpacing: "-0.03em",
              }}
            >
              Everything you need to control your schedule
            </Typography>

            <Typography
              sx={{
                maxWidth: 650,
                mx: "auto",
                mt: 1,
                color: "text.secondary",
                fontSize: "0.85rem",
              }}
            >
              Bring planning, dependency analysis and project
              intelligence into one workspace.
            </Typography>

          </Box>


          <Grid
            container
            spacing={2}
            sx={{
              mt: 4,
            }}
          >

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <FeatureCard
                icon={
                  <AccountTreeRounded />
                }
                title="Project Planning"
                description="Create projects, activities, milestones and dependencies in a structured workspace."
              />
            </Grid>


            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <FeatureCard
                icon={
                  <TimelineRounded />
                }
                title="CPM Analysis"
                description="Calculate schedules, identify critical activities and understand project duration."
              />
            </Grid>


            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <FeatureCard
                icon={
                  <AnalyticsRounded />
                }
                title="Float Analysis"
                description="Understand activity flexibility and identify where schedule delays can be absorbed."
              />
            </Grid>

          </Grid>

        </Box>


        {/* =====================================================
            WORKFLOW
        ===================================================== */}

        <Box
          sx={{
            pb: 10,
          }}
        >

          <Box
            sx={{
              borderRadius: 4,
              p: {
                xs: 3,
                md: 5,
              },
              background:
                "linear-gradient(135deg, rgba(23,59,115,0.06), rgba(13,146,184,0.08))",
              border: "1px solid",
              borderColor: "divider",
            }}
          >

            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 750,
                color: "secondary.main",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Simple Workflow
            </Typography>


            <Typography
              variant="h4"
              sx={{
                mt: 0.8,
                fontWeight: 750,
                letterSpacing: "-0.03em",
              }}
            >
              From project setup to schedule insight
            </Typography>


            <Grid
              container
              spacing={3}
              sx={{
                mt: 2,
              }}
            >

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <WorkflowStep
                  number="01"
                  icon={
                    <DashboardRounded />
                  }
                  title="Create"
                  description="Set up your project and define the planning structure."
                />
              </Grid>


              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <WorkflowStep
                  number="02"
                  icon={
                    <AccountTreeRounded />
                  }
                  title="Connect"
                  description="Add activities and define relationships and dependencies."
                />
              </Grid>


              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <WorkflowStep
                  number="03"
                  icon={
                    <TimelineRounded />
                  }
                  title="Analyze"
                  description="Run CPM and float calculations to understand your schedule."
                />
              </Grid>


              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <WorkflowStep
                  number="04"
                  icon={
                    <CheckCircleRounded />
                  }
                  title="Act"
                  description="Use critical-path insights to make better project decisions."
                />
              </Grid>

            </Grid>

          </Box>

        </Box>


        {/* =====================================================
            CALL TO ACTION
        ===================================================== */}

        <Box
          sx={{
            pb: 10,
          }}
        >

          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "#FFFFFF",
            }}
          >

            <CardContent
              sx={{
                py: {
                  xs: 4,
                  md: 5,
                },
                px: {
                  xs: 3,
                  md: 6,
                },
                textAlign: "center",
              }}
            >

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 750,
                  letterSpacing: "-0.03em",
                }}
              >
                Ready to build a better project schedule?
              </Typography>


              <Typography
                sx={{
                  mt: 1,
                  color: "text.secondary",
                  fontSize: "0.88rem",
                }}
              >
                Create your organization workspace and start
                managing your project schedule with confidence.
              </Typography>


              <Button
                component={Link}
                to={ROUTES.REGISTER}
                variant="contained"
                size="large"
                endIcon={
                  <ArrowForwardRounded />
                }
                sx={{
                  mt: 3,
                  px: 4,
                  borderRadius: 2,
                }}
              >
                Register Your Organization
              </Button>

            </CardContent>

          </Card>

        </Box>

      </Container>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          backgroundColor: "#FFFFFF",
        }}
      >

        <Container maxWidth="lg">

          <Box
            sx={{
              py: 3,
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              justifyContent: "space-between",
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              gap: 1,
            }}
          >

            <Typography
              sx={{
                fontSize: "0.76rem",
                fontWeight: 700,
                color: "primary.main",
              }}
            >
              IndusPathFinder
            </Typography>

            <Typography
              sx={{
                fontSize: "0.72rem",
                color: "text.secondary",
              }}
            >
              Project Scheduling & CPM Analysis
            </Typography>

          </Box>

        </Container>

      </Box>

    </Box>
  );
}


/*
 * ============================================================
 * FEATURE CARD
 * ============================================================
 */

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        backgroundColor: "#FFFFFF",
      }}
    >

      <CardContent
        sx={{
          p: 3,
        }}
      >

        <Box
          sx={{
            width: 46,
            height: 46,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            color: "primary.main",
            background:
              "linear-gradient(135deg, rgba(23,59,115,0.09), rgba(13,146,184,0.13))",

            "& svg": {
              fontSize: 24,
            },
          }}
        >
          {icon}
        </Box>


        <Typography
          sx={{
            mt: 2,
            fontWeight: 750,
            fontSize: "1rem",
          }}
        >
          {title}
        </Typography>


        <Typography
          sx={{
            mt: 0.8,
            color: "text.secondary",
            fontSize: "0.78rem",
            lineHeight: 1.7,
          }}
        >
          {description}
        </Typography>

      </CardContent>

    </Card>
  );
}


/*
 * ============================================================
 * WORKFLOW STEP
 * ============================================================
 */

interface WorkflowStepProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function WorkflowStep({
  number,
  icon,
  title,
  description,
}: WorkflowStepProps) {

  return (
    <Box>

      <Typography
        sx={{
          fontSize: "0.65rem",
          fontWeight: 800,
          color: "secondary.main",
          letterSpacing: "0.08em",
        }}
      >
        {number}
      </Typography>


      <Box
        sx={{
          width: 40,
          height: 40,
          mt: 0.8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 2,
          color: "primary.main",
          backgroundColor:
            "rgba(23,59,115,0.08)",

          "& svg": {
            fontSize: 21,
          },
        }}
      >
        {icon}
      </Box>


      <Typography
        sx={{
          mt: 1.3,
          fontWeight: 750,
          fontSize: "0.9rem",
        }}
      >
        {title}
      </Typography>


      <Typography
        sx={{
          mt: 0.5,
          color: "text.secondary",
          fontSize: "0.74rem",
          lineHeight: 1.6,
        }}
      >
        {description}
      </Typography>

    </Box>
  );
}

