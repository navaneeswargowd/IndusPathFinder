import {
  AccessTimeRounded,
  AccountTreeRounded,
  CheckCircleOutlineRounded,
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
  runCPMApi,
} from "../../api/cpm.api";

import type {
  CPMRequest,
  CPMResult,
} from "../../types/cpm.types";

import {
  getErrorMessage,
} from "../../utils/error.utils";

import CPMResultTable from "./CPMResultTable";

interface CPMAnalysisTabProps {
  projectId:
    number;
}

export default function CPMAnalysisTab({
  projectId,
}: CPMAnalysisTabProps) {
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
   *
   * Each project keeps its own CPM result.
   */

  const cacheKey = [
    "cpm-analysis",
    projectId,
  ] as const;

  /*
   * ==========================================================
   * EXISTING RESULT
   * ==========================================================
   *
   * If the user already ran CPM and changed tabs,
   * this retrieves the previous result.
   */

  const cachedResults =
    queryClient.getQueryData<
      CPMResult[]
    >(
      cacheKey
    ) ?? [];

  /*
   * ==========================================================
   * RUN CPM
   * ==========================================================
   */

  const mutation =
    useMutation<
      CPMResult[],
      unknown,
      CPMRequest
    >({
      mutationFn:
        runCPMApi,

      onSuccess:
        (
          response
        ) => {
          /*
           * Store latest CPM result.
           */

          queryClient.setQueryData<
            CPMResult[]
          >(
            cacheKey,
            response
          );

          enqueueSnackbar(
            "CPM analysis completed successfully.",
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
   *
   * mutation.data = latest result during current render
   *
   * cachedResults = previously calculated result
   */

  const results:
    CPMResult[] =
      mutation.data ??
      cachedResults;

  /*
   * ==========================================================
   * PROJECT DURATION
   * ==========================================================
   */

  const projectDuration =
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
                CPMResult
            ) =>
              result.earlyFinish
          )
        );
      },
      [
        results,
      ]
    );

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
              CPMResult
          ) =>
            result.critical
        ),
      [
        results,
      ]
    );

  const nonCriticalActivities =
    results.length -
    criticalActivities.length;

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
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

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
            <AccountTreeRounded />
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
              Critical Path Method
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
              Calculate early and late
              schedule values and identify
              critical activities.
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
                : "Run CPM Analysis"}
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

      {/* ================================================== */}
      {/* INITIAL STATE */}
      {/* ================================================== */}

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
            <AccountTreeRounded
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
            Ready to analyze the schedule
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
            Run CPM after defining project
            activities and dependencies.
            The analysis calculates ES, EF,
            LS and LF and identifies the
            critical path.
          </Typography>
        </Paper>
      )}

      {/* ================================================== */}
      {/* LOADING */}
      {/* ================================================== */}

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
            Running CPM analysis...
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
            Calculating forward pass,
            backward pass and critical
            activities.
          </Typography>
        </Paper>
      )}

      {/* ================================================== */}
      {/* RESULTS */}
      {/* ================================================== */}

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
                <AccessTimeRounded />
              }
              label="Project Duration"
              value={`${projectDuration} days`}
              helper="Calculated completion time"
            />

            <MetricCard
              icon={
                <AccountTreeRounded />
              }
              label="Total Activities"
              value={
                String(
                  results.length
                )
              }
              helper="Activities included in analysis"
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
              helper="Activities with zero scheduling flexibility"
            />

            <MetricCard
              icon={
                <CheckCircleOutlineRounded />
              }
              label="Non-Critical"
              value={
                String(
                  nonCriticalActivities
                )
              }
              helper="Activities with schedule flexibility"
            />
          </Box>

          <Paper
            elevation={0}
            sx={{
              p:
                2,

              mb:
                1.5,

              border:
                "1px solid",

              borderColor:
                "divider",

              borderRadius:
                2.5,
            }}
          >
            <Typography
              sx={{
                fontWeight:
                  750,

                fontSize:
                  "0.9rem",
              }}
            >
              Critical Path
            </Typography>

            <Typography
              sx={{
                mt:
                  0.7,

                color:
                  criticalActivities.length >
                  0
                    ? "error.main"
                    : "text.secondary",

                fontWeight:
                  criticalActivities.length >
                  0
                    ? 700
                    : 500,

                fontSize:
                  "0.78rem",

                lineHeight:
                  1.7,
              }}
            >
              {criticalActivities.length >
              0
                ? criticalActivities
                    .map(
                      (
                        result:
                          CPMResult
                      ) =>
                        result.activityCode
                    )
                    .join(
                      "  →  "
                    )
                : "No critical activities identified."}
            </Typography>
          </Paper>

          <CPMResultTable
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

            flexShrink:
              0,

            borderRadius:
              1.8,

            color:
              "#078E91",

            backgroundColor:
              "#E8F7F7",

            "& svg": {
              fontSize:
                19,
            },
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