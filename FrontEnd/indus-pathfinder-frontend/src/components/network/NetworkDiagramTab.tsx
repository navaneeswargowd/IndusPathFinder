import {
  AccountTreeRounded,
  CenterFocusStrongRounded,
  PlayArrowRounded,
  RefreshRounded,
  ZoomInRounded,
  ZoomOutRounded,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  useState,
} from "react";

import {
  useSnackbar,
} from "notistack";

import {
  generateNetworkDiagramApi,
} from "../../api/network.api";

import type {
  NetworkDiagram,
  NetworkDiagramRequest,
} from "../../types/network.types";

import {
  getErrorMessage,
} from "../../utils/error.utils";

import NetworkGraph from "./NetworkGraph";

interface NetworkDiagramTabProps {
  projectId:
    number;
}

export default function NetworkDiagramTab({
  projectId,
}: NetworkDiagramTabProps) {
  const {
    enqueueSnackbar,
  } =
    useSnackbar();

  const queryClient =
    useQueryClient();

  const [
    zoom,
    setZoom,
  ] =
    useState(
      1
    );

  /*
   * ==========================================================
   * CACHE KEY
   * ==========================================================
   *
   * Every project keeps its own generated
   * network diagram.
   */

  const cacheKey = [
    "network-diagram",
    projectId,
  ] as const;

  /*
   * ==========================================================
   * EXISTING CACHED DIAGRAM
   * ==========================================================
   *
   * When the user changes tabs and comes back,
   * the previously generated diagram is restored
   * from React Query cache.
   */

  const cachedDiagram =
    queryClient.getQueryData<
      NetworkDiagram
    >(
      cacheKey
    );

  /*
   * ==========================================================
   * GENERATE NETWORK DIAGRAM
   * ==========================================================
   */

  const mutation =
    useMutation<
      NetworkDiagram,
      unknown,
      NetworkDiagramRequest
    >({
      mutationFn:
        generateNetworkDiagramApi,

      onSuccess:
        (
          response
        ) => {
          /*
           * Store the newly generated diagram
           * in React Query cache.
           */

          queryClient.setQueryData<
            NetworkDiagram
          >(
            cacheKey,
            response
          );

          /*
           * Reset zoom whenever a new
           * diagram is generated.
           */

          setZoom(
            1
          );

          enqueueSnackbar(
            "Network diagram generated successfully.",
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
   * DIAGRAM
   * ==========================================================
   *
   * mutation.data:
   * latest generated diagram
   *
   * cachedDiagram:
   * previously generated diagram when
   * user returns to this tab
   */

  const diagram =
    mutation.data ??
    cachedDiagram;

  /*
   * ==========================================================
   * GENERATE / REFRESH
   * ==========================================================
   */

  const handleGenerate =
    () => {
      mutation.mutate({
        projectId:
          Number(
            projectId
          ),
      });
    };

  /*
   * ==========================================================
   * CRITICAL COUNT
   * ==========================================================
   */

  const criticalCount =
    diagram
      ?.nodes
      .filter(
        (
          node
        ) =>
          node.critical
      )
      .length ??
    0;

  return (
    <Box>
      {/* =============================================== */}
      {/* HEADER */}
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
            <AccountTreeRounded />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize:
                  "0.95rem",

                fontWeight:
                  750,
              }}
            >
              Activity Network Diagram
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
              Visualize activity sequence,
              dependencies and critical
              path relationships.
            </Typography>
          </Box>
        </Box>

        {/* ============================================= */}
        {/* GENERATE / REFRESH BUTTON */}
        {/* ============================================= */}

        <Box
          sx={{
            display:
              "flex",

            gap:
              1,

            flexWrap:
              "wrap",
          }}
        >
          {!diagram ? (
            /*
             * First time:
             * Generate Diagram
             */
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
                handleGenerate
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
                ? "Generating..."
                : "Generate Diagram"}
            </Button>
          ) : (
            /*
             * Diagram already exists:
             * only show refresh.
             */
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
                handleGenerate
              }
            >
              {mutation.isPending
                ? "Generating..."
                : "Refresh Diagram"}
            </Button>
          )}
        </Box>
      </Paper>

      {/* =============================================== */}
      {/* INITIAL STATE */}
      {/* =============================================== */}

      {!diagram &&
        !mutation.isPending && (
        <Paper
          elevation={0}
          sx={{
            minHeight:
              320,

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
          }}
        >
          <Box
            sx={{
              width:
                66,

              height:
                66,

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
                  31,
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
            Generate the activity network
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
            The diagram uses project
            activities and dependencies to
            visualize schedule sequencing
            and critical activities.
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
              280,

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
            Generating network diagram...
          </Typography>

          <Typography
            sx={{
              mt:
                0.5,

              color:
                "text.secondary",

              fontSize:
                "0.73rem",
            }}
          >
            Building activity nodes and
            dependency connections.
          </Typography>
        </Paper>
      )}

      {/* =============================================== */}
      {/* DIAGRAM */}
      {/* =============================================== */}

      {diagram &&
        !mutation.isPending && (
        <>
          {/* =========================================== */}
          {/* DIAGRAM INFORMATION / CONTROLS */}
          {/* =========================================== */}

          <Box
            sx={{
              mb:
                1.5,

              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

              flexWrap:
                "wrap",

              gap:
                1.5,
            }}
          >
            {/* ========================================= */}
            {/* STATISTICS */}
            {/* ========================================= */}

            <Box
              sx={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  0.8,

                flexWrap:
                  "wrap",
              }}
            >
              <Chip
                label={`${diagram.nodes.length} activities`}
                size="small"
              />

              <Chip
                label={`${diagram.edges.length} dependencies`}
                size="small"
              />

              <Chip
                label={`${criticalCount} critical`}
                size="small"
                sx={{
                  color:
                    "#B42318",

                  backgroundColor:
                    "#FFF1F0",
                }}
              />

              {/* ======================================= */}
              {/* CRITICAL PATH LEGEND */}
              {/* ======================================= */}

              <Box
                sx={{
                  display:
                    "flex",

                  alignItems:
                    "center",

                  gap:
                    0.5,

                  ml: {
                    sm:
                      1,
                  },
                }}
              >
                <Box
                  sx={{
                    width:
                      20,

                    height:
                      3,

                    borderRadius:
                      2,

                    backgroundColor:
                      "#D92D20",
                  }}
                />

                <Typography
                  sx={{
                    fontSize:
                      "0.65rem",

                    color:
                      "text.secondary",
                  }}
                >
                  Critical path
                </Typography>
              </Box>
            </Box>

            {/* ========================================= */}
            {/* ZOOM CONTROLS */}
            {/* ========================================= */}

            <Box
              sx={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  0.4,
              }}
            >
              {/* ZOOM OUT */}

              <Tooltip title="Zoom Out">
                <span>
                  <IconButton
                    size="small"
                    disabled={
                      zoom <=
                      0.6
                    }
                    onClick={() =>
                      setZoom(
                        (
                          current
                        ) =>
                          Math.max(
                            0.6,
                            current -
                              0.1
                          )
                      )
                    }
                  >
                    <ZoomOutRounded />
                  </IconButton>
                </span>
              </Tooltip>

              {/* ZOOM VALUE */}

              <Typography
                sx={{
                  minWidth:
                    42,

                  textAlign:
                    "center",

                  fontSize:
                    "0.7rem",

                  fontWeight:
                    700,
                }}
              >
                {Math.round(
                  zoom *
                    100
                )}
                %
              </Typography>

              {/* ZOOM IN */}

              <Tooltip title="Zoom In">
                <span>
                  <IconButton
                    size="small"
                    disabled={
                      zoom >=
                      1.5
                    }
                    onClick={() =>
                      setZoom(
                        (
                          current
                        ) =>
                          Math.min(
                            1.5,
                            current +
                              0.1
                          )
                      )
                    }
                  >
                    <ZoomInRounded />
                  </IconButton>
                </span>
              </Tooltip>

              {/* RESET */}

              <Tooltip title="Reset Zoom">
                <IconButton
                  size="small"
                  disabled={
                    zoom ===
                    1
                  }
                  onClick={() =>
                    setZoom(
                      1
                    )
                  }
                >
                  <CenterFocusStrongRounded />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* =========================================== */}
          {/* NETWORK GRAPH */}
          {/* =========================================== */}

          <Paper
            elevation={0}
            sx={{
              height:
                520,

              overflow:
                "hidden",

              border:
                "1px solid",

              borderColor:
                "divider",

              borderRadius:
                2.5,
            }}
          >
            <NetworkGraph
              diagram={
                diagram
              }
              zoom={
                zoom
              }
            />
          </Paper>
        </>
      )}
    </Box>
  );
}