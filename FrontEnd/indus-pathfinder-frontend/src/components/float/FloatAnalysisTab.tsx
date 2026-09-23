import {
  AccountTreeRounded,
  CheckCircleOutlineRounded,
  HourglassBottomRounded,
  PlayArrowRounded,
  RefreshRounded,
  WarningAmberRounded,
} from "@mui/icons-material";

import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import {
  useMemo,
} from "react";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  useSnackbar,
} from "notistack";

import {
  runFloatAnalysisApi,
} from "../../api/float.api";

import type {
  FloatAnalysisResult,
  FloatRequest,
} from "../../types/float.types";

import {
  getErrorMessage,
} from "../../utils/error.utils";

import FloatResultTable from "./FloatResultTable";

interface FloatAnalysisTabProps {
  projectId:
    number;
}

export default function FloatAnalysisTab({
  projectId,
}: FloatAnalysisTabProps) {
  const {
    enqueueSnackbar,
  } =
    useSnackbar();

  const queryClient =
    useQueryClient();

  /*
   * ==========================================================
   * CACHE KEY
   * ==========================================================
   */

  const cacheKey = [
    "float-analysis",
    projectId,
  ] as const;

  /*
   * ==========================================================
   * EXISTING RESULT
   * ==========================================================
   */

  const cachedResults =
    queryClient.getQueryData<
      FloatAnalysisResult[]
    >(
      cacheKey
    ) ?? [];

  /*
   * ==========================================================
   * RUN FLOAT ANALYSIS
   * ==========================================================
   */

  const mutation =
    useMutation<
      FloatAnalysisResult[],
      unknown,
      FloatRequest
    >({
      mutationFn:
        runFloatAnalysisApi,

      onSuccess:
        (
          response
        ) => {
          /*
           * Store latest analysis result
           * for this project.
           */

          queryClient.setQueryData<
            FloatAnalysisResult[]
          >(
            cacheKey,
            response
          );

          enqueueSnackbar(
            "Float analysis completed successfully.",
            {
              variant:
                "success",
            }
          );
        },

      onError:
        (
          error
        ) => {
          enqueueSnackbar(
            getErrorMessage(
              error
            ),
            {
              variant:
                "error",
            }
          );
        },
    });

  /*
   * ==========================================================
   * RESULTS
   * ==========================================================
   */

  const results:
    FloatAnalysisResult[] =
      mutation.data ??
      cachedResults;

  /*
   * ==========================================================
   * CRITICAL ACTIVITIES
   * ==========================================================
   */

  const criticalActivities =
    useMemo(
      () =>
        results.filter(
          (
            result:
              FloatAnalysisResult
          ) =>
            result.critical
        ),
      [
        results,
      ]
    );

  const flexibleActivities =
    results.length -
    criticalActivities.length;

  /*
   * ==========================================================
   * MAXIMUM FLOAT
   * ==========================================================
   */

  const maxTotalFloat =
    useMemo(
      () => {
        if (
          results.length ===
          0
        ) {
          return 0;
        }

        return Math.max(
          ...results.map(
            (
              result:
                FloatAnalysisResult
            ) =>
              result.totalFloat
          )
        );
      },
      [
        results,
      ]
    );

  /*
   * ==========================================================
   * RUN / RE-RUN
   * ==========================================================
   */

  const handleRun =
    () => {
      mutation.mutate({
        projectId:
          Number(
            projectId
          ),
      });
    };

  return (
    <Box>
      {/* =============================================== */}
      {/* RUN PANEL */}
      {/* =============================================== */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs:
              2,

            md:
              2.5,
          },

          mb:
            2,

          display:
            "flex",

          flexDirection: {
            xs:
              "column",

            md:
              "row",
          },

          alignItems: {
            xs:
              "flex-start",

            md:
              "center",
          },

          justifyContent:
            "space-between",

          gap:
            2,

          border:
            "1px solid",

          borderColor:
            "divider",

          borderRadius:
            2.5,

          background:
            "linear-gradient(135deg, #F8FAFC 0%, #EEF7F8 100%)",
        }}
      >
        <Box
          sx={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              1.4,
          }}
        >
          <Box
            sx={{
              width:
                46,

              height:
                46,

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              flexShrink:
                0,

              borderRadius:
                2.2,

              color:
                "#078E91",

              backgroundColor:
                "#E8F7F7",
            }}
          >
            <HourglassBottomRounded />
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight:
                  750,

                fontSize:
                  "0.95rem",
              }}
            >
              Float Analysis
            </Typography>

            <Typography
              sx={{
                mt:
                  0.25,

                color:
                  "text.secondary",

                fontSize:
                  "0.72rem",

                lineHeight:
                  1.6,
              }}
            >
              Calculate Total Float,
              Free Float and Independent
              Float for project activities.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display:
              "flex",

            flexWrap:
              "wrap",

            gap:
              1,
          }}
        >
          {results.length ===
          0 ? (
            <Button
              variant="contained"
              startIcon={
                mutation.isPending
                  ? undefined
                  : <PlayArrowRounded />
              }
              disabled={
                mutation.isPending
              }
              onClick={
                handleRun
              }
              sx={{
                backgroundColor:
                  "#078E91",

                "&:hover":
                  {
                    backgroundColor:
                      "#067A7D",
                  },
              }}
            >
              {mutation.isPending
                ? "Running..."
                : "Run Float Analysis"}
            </Button>
          ) : (
            <Button
              variant="outlined"
              startIcon={
                mutation.isPending
                  ? undefined
                  : <RefreshRounded />
              }
              disabled={
                mutation.isPending
              }
              onClick={
                handleRun
              }
            >
              {mutation.isPending
                ? "Running..."
                : "Re-run"}
            </Button>
          )}
        </Box>
      </Paper>

      {/* =============================================== */}
      {/* EMPTY STATE */}
      {/* =============================================== */}

      {results.length ===
        0 &&
        !mutation.isPending && (
        <Paper
          elevation={0}
          sx={{
            minHeight:
              300,

            display:
              "flex",

            flexDirection:
              "column",

            alignItems:
              "center",

            justifyContent:
              "center",

            px:
              3,

            textAlign:
              "center",

            border:
              "1px dashed",

            borderColor:
              "#CBD5E1",

            borderRadius:
              2.5,

            backgroundColor:
              "#FCFDFE",
          }}
        >
          <Box
            sx={{
              width:
                64,

              height:
                64,

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              borderRadius:
                "50%",

              color:
                "#078E91",

              backgroundColor:
                "#E8F7F7",
            }}
          >
            <HourglassBottomRounded
              sx={{
                fontSize:
                  30,
              }}
            />
          </Box>

          <Typography
            sx={{
              mt:
                2,

              fontWeight:
                750,

              fontSize:
                "1rem",
            }}
          >
            Ready to calculate float
          </Typography>

          <Typography
            sx={{
              mt:
                0.7,

              maxWidth:
                520,

              color:
                "text.secondary",

              fontSize:
                "0.76rem",

              lineHeight:
                1.7,
            }}
          >
            Run Float Analysis after
            activities and dependencies
            are configured. This identifies
            where schedule flexibility
            exists.
          </Typography>
        </Paper>
      )}

      {/* =============================================== */}
      {/* LOADING */}
      {/* =============================================== */}

      {mutation.isPending && (
        <Paper
          elevation={0}
          sx={{
            minHeight:
              250,

            display:
              "flex",

            flexDirection:
              "column",

            alignItems:
              "center",

            justifyContent:
              "center",

            border:
              "1px solid",

            borderColor:
              "divider",

            borderRadius:
              2.5,
          }}
        >
          <CircularProgress
            size={
              34
            }
          />

          <Typography
            sx={{
              mt:
                2,

              fontWeight:
                700,
            }}
          >
            Running Float Analysis...
          </Typography>

          <Typography
            sx={{
              mt:
                0.5,

              color:
                "text.secondary",

              fontSize:
                "0.74rem",
            }}
          >
            Calculating total, free and
            independent float values.
          </Typography>
        </Paper>
      )}

      {/* =============================================== */}
      {/* RESULTS */}
      {/* =============================================== */}

      {results.length >
        0 &&
        !mutation.isPending && (
        <>
          <Box
            sx={{
              mb:
                2,

              display:
                "grid",

              gridTemplateColumns: {
                xs:
                  "1fr",

                sm:
                  "repeat(2, minmax(0, 1fr))",

                xl:
                  "repeat(4, minmax(0, 1fr))",
              },

              gap:
                1.5,
            }}
          >
            <MetricCard
              icon={
                <AccountTreeRounded />
              }
              label="Analyzed Activities"
              value={
                String(
                  results.length
                )
              }
              helper="Activities included in float calculation"
            />

            <MetricCard
              icon={
                <WarningAmberRounded />
              }
              label="Critical Activities"
              value={
                String(
                  criticalActivities.length
                )
              }
              helper="Activities with zero total float"
            />

            <MetricCard
              icon={
                <CheckCircleOutlineRounded />
              }
              label="Flexible Activities"
              value={
                String(
                  flexibleActivities
                )
              }
              helper="Activities with available scheduling flexibility"
            />

            <MetricCard
              icon={
                <HourglassBottomRounded />
              }
              label="Maximum Total Float"
              value={
                String(
                  maxTotalFloat
                )
              }
              helper="Largest total float in the current schedule"
            />
          </Box>

          <FloatResultTable
            results={
              results
            }
          />
        </>
      )}
    </Box>
  );
}

interface MetricCardProps {
  icon:
    React.ReactNode;

  label:
    string;

  value:
    string;

  helper:
    string;
}

function MetricCard({
  icon,
  label,
  value,
  helper,
}: MetricCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p:
          2,

        border:
          "1px solid",

        borderColor:
          "divider",

        borderRadius:
          2.5,
      }}
    >
      <Box
        sx={{
          display:
            "flex",

          alignItems:
            "center",

          gap:
            1,
        }}
      >
        <Box
          sx={{
            width:
              34,

            height:
              34,

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            borderRadius:
              1.8,

            color:
              "#078E91",

            backgroundColor:
              "#E8F7F7",
          }}
        >
          {icon}
        </Box>

        <Typography
          sx={{
            color:
              "text.secondary",

            fontSize:
              "0.68rem",

            fontWeight:
              650,
          }}
        >
          {label}
        </Typography>
      </Box>

      <Typography
        sx={{
          mt:
            1.5,

          fontSize:
            "1.55rem",

          fontWeight:
            760,

          letterSpacing:
            "-0.035em",
        }}
      >
        {value}
      </Typography>

      <Typography
        sx={{
          mt:
            0.4,

          color:
            "text.secondary",

          fontSize:
            "0.66rem",
        }}
      >
        {helper}
      </Typography>
    </Paper>
  );
}