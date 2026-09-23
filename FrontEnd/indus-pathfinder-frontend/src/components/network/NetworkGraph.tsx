import {
  Box,
  Chip,
  Typography,
} from "@mui/material";

import {
  useMemo,
} from "react";

import type {
  NetworkDiagram,
  NetworkEdge,
  NetworkNode,
} from "../../types/network.types";

interface NetworkGraphProps {
  diagram: NetworkDiagram;

  zoom: number;
}

interface PositionedNode {
  node: NetworkNode;

  x: number;

  y: number;

  level: number;
}

const NODE_WIDTH =
  190;

const NODE_HEIGHT =
  100;

const X_GAP =
  105;

const Y_GAP =
  45;

const PADDING =
  50;

export default function NetworkGraph({
  diagram,
  zoom,
}: NetworkGraphProps) {
  const layout =
    useMemo(
      () =>
        buildLayout(
          diagram
        ),
      [
        diagram,
      ]
    );

  if (
    diagram.nodes.length ===
    0
  ) {
    return (
      <Box
        sx={{
          minHeight:
            320,

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          textAlign:
            "center",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight:
                700,

              fontSize:
                "0.9rem",
            }}
          >
            No network data available
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
            Add project activities and
            dependencies before generating
            the network diagram.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width:
          "100%",

        overflow:
          "auto",

        backgroundColor:
          "#F8FAFC",

        backgroundImage:
          "radial-gradient(#CBD5E1 0.7px, transparent 0.7px)",

        backgroundSize:
          "18px 18px",
      }}
    >
      <Box
        sx={{
          position:
            "relative",

          width:
            layout.width,

          height:
            layout.height,

          minWidth:
            "100%",

          transform:
            `scale(${zoom})`,

          transformOrigin:
            "top left",

          transition:
            "transform 150ms ease",
        }}
      >
        {/* =============================================== */}
        {/* SVG EDGES */}
        {/* =============================================== */}

        <svg
          width={
            layout.width
          }
          height={
            layout.height
          }
          style={{
            position:
              "absolute",

            inset:
              0,

            pointerEvents:
              "none",
          }}
        >
          <defs>
            <marker
              id="arrow-normal"
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path
                d="M0,0 L0,6 L9,3 z"
                fill="#64748B"
              />
            </marker>

            <marker
              id="arrow-critical"
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path
                d="M0,0 L0,6 L9,3 z"
                fill="#D92D20"
              />
            </marker>
          </defs>

          {diagram.edges.map(
            (
              edge,
              index
            ) => {
              const from =
                layout.positions.get(
                  edge.fromActivityId
                );

              const to =
                layout.positions.get(
                  edge.toActivityId
                );

              if (
                !from ||
                !to
              ) {
                return null;
              }

              const fromCritical =
                from.node.critical;

              const toCritical =
                to.node.critical;

              const criticalEdge =
                fromCritical &&
                toCritical;

              const startX =
                from.x +
                NODE_WIDTH;

              const startY =
                from.y +
                NODE_HEIGHT /
                  2;

              const endX =
                to.x;

              const endY =
                to.y +
                NODE_HEIGHT /
                  2;

              const middleX =
                startX +
                (
                  endX -
                  startX
                ) /
                  2;

              const path =
                `M ${startX} ${startY}
                 C ${middleX} ${startY},
                   ${middleX} ${endY},
                   ${endX} ${endY}`;

              const labelX =
                middleX;

              const labelY =
                (
                  startY +
                  endY
                ) /
                  2 -
                8;

              return (
                <g
                  key={`${edge.fromActivityId}-${edge.toActivityId}-${index}`}
                >
                  <path
                    d={
                      path
                    }
                    fill="none"
                    stroke={
                      criticalEdge
                        ? "#D92D20"
                        : "#64748B"
                    }
                    strokeWidth={
                      criticalEdge
                        ? 2.6
                        : 1.8
                    }
                    markerEnd={
                      criticalEdge
                        ? "url(#arrow-critical)"
                        : "url(#arrow-normal)"
                    }
                  />

                  <rect
                    x={
                      labelX -
                      22
                    }
                    y={
                      labelY -
                      10
                    }
                    width="44"
                    height="22"
                    rx="6"
                    fill="#FFFFFF"
                    stroke={
                      criticalEdge
                        ? "#FECDCA"
                        : "#D0D5DD"
                    }
                  />

                  <text
                    x={
                      labelX
                    }
                    y={
                      labelY +
                      5
                    }
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill={
                      criticalEdge
                        ? "#B42318"
                        : "#475467"
                    }
                  >
                    {
                      edge.dependencyType
                    }
                    {edge.lag
                      ? ` +${edge.lag}`
                      : ""}
                  </text>
                </g>
              );
            }
          )}
        </svg>

        {/* =============================================== */}
        {/* NODES */}
        {/* =============================================== */}

        {layout.nodes.map(
          (
            positioned
          ) => (
            <ActivityNodeCard
              key={
                positioned
                  .node
                  .activityId
              }
              positioned={
                positioned
              }
            />
          )
        )}
      </Box>
    </Box>
  );
}

function ActivityNodeCard({
  positioned,
}: {
  positioned:
    PositionedNode;
}) {
  const {
    node,
    x,
    y,
  } =
    positioned;

  return (
    <Box
      sx={{
        position:
          "absolute",

        left:
          x,

        top:
          y,

        width:
          NODE_WIDTH,

        height:
          NODE_HEIGHT,

        p:
          1.5,

        display:
          "flex",

        flexDirection:
          "column",

        justifyContent:
          "space-between",

        borderRadius:
          2.5,

        border:
          "1px solid",

        borderColor:
          node.critical
            ? "#FDA29B"
            : "#D0D5DD",

        backgroundColor:
          "#FFFFFF",

        boxShadow:
          node.critical
            ? "0 8px 25px rgba(217,45,32,0.10)"
            : "0 8px 22px rgba(15,23,42,0.06)",

        zIndex:
          2,
      }}
    >
      <Box>
        <Box
          sx={{
            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap:
              1,
          }}
        >
          <Typography
            sx={{
              color:
                node.critical
                  ? "#B42318"
                  : "primary.main",

              fontFamily:
                "monospace",

              fontSize:
                "0.66rem",

              fontWeight:
                750,
            }}
          >
            {
              node.activityCode
            }
          </Typography>

          {node.critical && (
            <Chip
              label="Critical"
              size="small"
              sx={{
                height:
                  20,

                fontSize:
                  "0.58rem",

                fontWeight:
                  700,

                color:
                  "#B42318",

                backgroundColor:
                  "#FFF1F0",
              }}
            />
          )}
        </Box>

        <Typography
          sx={{
            mt:
              0.8,

            fontSize:
              "0.78rem",

            fontWeight:
              700,

            lineHeight:
              1.35,

            overflow:
              "hidden",

            display:
              "-webkit-box",

            WebkitLineClamp:
              2,

            WebkitBoxOrient:
              "vertical",
          }}
        >
          {
            node.activityName
          }
        </Typography>
      </Box>

      <Typography
        sx={{
          color:
            "text.secondary",

          fontSize:
            "0.66rem",

          fontWeight:
            600,
        }}
      >
        {
          node.duration
        }{" "}
        days
      </Typography>
    </Box>
  );
}

function buildLayout(
  diagram:
    NetworkDiagram
) {
  const nodes =
    diagram.nodes;

  const edges =
    diagram.edges;

  const nodeMap =
    new Map<
      number,
      NetworkNode
    >();

  nodes.forEach(
    (
      node
    ) => {
      nodeMap.set(
        node.activityId,
        node
      );
    }
  );

  const incomingCount =
    new Map<
      number,
      number
    >();

  const outgoing =
    new Map<
      number,
      NetworkEdge[]
    >();

  nodes.forEach(
    (
      node
    ) => {
      incomingCount.set(
        node.activityId,
        0
      );

      outgoing.set(
        node.activityId,
        []
      );
    }
  );

  edges.forEach(
    (
      edge
    ) => {
      incomingCount.set(
        edge.toActivityId,
        (
          incomingCount.get(
            edge.toActivityId
          ) ??
          0
        ) + 1
      );

      const current =
        outgoing.get(
          edge.fromActivityId
        ) ??
        [];

      current.push(
        edge
      );

      outgoing.set(
        edge.fromActivityId,
        current
      );
    }
  );

  const level =
    new Map<
      number,
      number
    >();

  const queue:
    number[] =
    [];

  nodes.forEach(
    (
      node
    ) => {
      if (
        (
          incomingCount.get(
            node.activityId
          ) ??
          0
        ) === 0
      ) {
        queue.push(
          node.activityId
        );

        level.set(
          node.activityId,
          0
        );
      }
    }
  );

  const mutableIncoming =
    new Map(
      incomingCount
    );

  while (
    queue.length >
    0
  ) {
    const currentId =
      queue.shift();

    if (
      currentId ===
      undefined
    ) {
      break;
    }

    const currentLevel =
      level.get(
        currentId
      ) ??
      0;

    const currentOutgoing =
      outgoing.get(
        currentId
      ) ??
      [];

    currentOutgoing.forEach(
      (
        edge
      ) => {
        const nextId =
          edge.toActivityId;

        const existingLevel =
          level.get(
            nextId
          ) ??
          0;

        level.set(
          nextId,
          Math.max(
            existingLevel,
            currentLevel +
              1
          )
        );

        const remaining =
          (
            mutableIncoming.get(
              nextId
            ) ??
            1
          ) - 1;

        mutableIncoming.set(
          nextId,
          remaining
        );

        if (
          remaining ===
          0
        ) {
          queue.push(
            nextId
          );
        }
      }
    );
  }

  /*
   * Safety fallback:
   * nodes not assigned to a level
   * are placed at level 0.
   */
  nodes.forEach(
    (
      node
    ) => {
      if (
        !level.has(
          node.activityId
        )
      ) {
        level.set(
          node.activityId,
          0
        );
      }
    }
  );

  const groups =
    new Map<
      number,
      NetworkNode[]
    >();

  nodes.forEach(
    (
      node
    ) => {
      const nodeLevel =
        level.get(
          node.activityId
        ) ??
        0;

      const group =
        groups.get(
          nodeLevel
        ) ??
        [];

      group.push(
        node
      );

      groups.set(
        nodeLevel,
        group
      );
    }
  );

  const positioned:
    PositionedNode[] =
    [];

  const positions =
    new Map<
      number,
      PositionedNode
    >();

  let maxLevel =
    0;

  let maxRows =
    1;

  groups.forEach(
    (
      group,
      groupLevel
    ) => {
      maxLevel =
        Math.max(
          maxLevel,
          groupLevel
        );

      maxRows =
        Math.max(
          maxRows,
          group.length
        );

      group.forEach(
        (
          node,
          index
        ) => {
          const positionedNode:
            PositionedNode =
            {
              node,

              level:
                groupLevel,

              x:
                PADDING +
                groupLevel *
                  (
                    NODE_WIDTH +
                    X_GAP
                  ),

              y:
                PADDING +
                index *
                  (
                    NODE_HEIGHT +
                    Y_GAP
                  ),
            };

          positioned.push(
            positionedNode
          );

          positions.set(
            node.activityId,
            positionedNode
          );
        }
      );
    }
  );

  const width =
    PADDING *
      2 +
    (
      maxLevel +
      1
    ) *
      NODE_WIDTH +
    maxLevel *
      X_GAP;

  const height =
    PADDING *
      2 +
    maxRows *
      NODE_HEIGHT +
    (
      maxRows -
      1
    ) *
      Y_GAP;

  return {
    nodes:
      positioned,

    positions,

    width:
      Math.max(
        width,
        900
      ),

    height:
      Math.max(
        height,
        420
      ),
  };
}