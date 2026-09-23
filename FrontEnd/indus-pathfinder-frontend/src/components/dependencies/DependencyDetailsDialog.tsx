import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import {
  ArrowForwardRounded,
} from "@mui/icons-material";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  getDependencyDetailsApi,
} from "../../api/dependency.api";

interface DependencyDetailsDialogProps {
  dependencyId:
    number | null;

  open:
    boolean;

  onClose:
    () => void;
}

export default function DependencyDetailsDialog({
  dependencyId,
  open,
  onClose,
}: DependencyDetailsDialogProps) {
  const query =
    useQuery({
      queryKey: [
        "dependency-details",
        dependencyId,
      ],

      queryFn: () =>
        getDependencyDetailsApi({
          dependencyId:
            dependencyId!,
        }),

      enabled:
        open &&
        dependencyId !==
          null,
    });

  const dependency =
    query.data;

  return (
    <Dialog
      open={
        open
      }
      onClose={
        onClose
      }
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Dependency Details
      </DialogTitle>

      <DialogContent
        dividers
      >
        {query.isLoading && (
          <Typography>
            Loading dependency...
          </Typography>
        )}

        {query.isError && (
          <Typography
            color="error"
          >
            Unable to load dependency.
          </Typography>
        )}

        {dependency && (
          <Box>
            <Box
              sx={{
                display:
                  "grid",

                gridTemplateColumns:
                  "1fr auto 1fr",

                alignItems:
                  "center",

                gap:
                  2,

                p:
                  2.5,

                borderRadius:
                  3,

                backgroundColor:
                  "#F8FAFC",

                border:
                  "1px solid",

                borderColor:
                  "divider",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color:
                      "text.secondary",

                    fontSize:
                      "0.67rem",
                  }}
                >
                  Predecessor
                </Typography>

                <Typography
                  sx={{
                    mt:
                      0.4,

                    fontWeight:
                      700,

                    fontSize:
                      "0.82rem",
                  }}
                >
                  {
                    dependency
                      .predecessorActivityName
                  }
                </Typography>
              </Box>

              <Box
                sx={{
                  width:
                    38,

                  height:
                    38,

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
                <ArrowForwardRounded />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color:
                      "text.secondary",

                    fontSize:
                      "0.67rem",
                  }}
                >
                  Successor
                </Typography>

                <Typography
                  sx={{
                    mt:
                      0.4,

                    fontWeight:
                      700,

                    fontSize:
                      "0.82rem",
                  }}
                >
                  {
                    dependency
                      .successorActivityName
                  }
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                mt:
                  2.5,
              }}
            >
              <Typography
                sx={{
                  color:
                    "text.secondary",

                  fontSize:
                    "0.68rem",
                }}
              >
                Dependency Type
              </Typography>

              <Chip
                label={
                  dependency
                    .dependencyType
                }
                size="small"
                sx={{
                  mt:
                    0.7,

                  fontWeight:
                    750,
                }}
              />
            </Box>

            <Box
              sx={{
                mt:
                  2.5,

                display:
                  "grid",

                gridTemplateColumns: {
                  xs:
                    "1fr",

                  sm:
                    "repeat(2, 1fr)",
                },

                gap:
                  2,
              }}
            >
              <Detail
                label="Created On"
                value={
                  dependency.createdOn ??
                  "-"
                }
              />

              <Detail
                label="Updated On"
                value={
                  dependency.updatedOn ??
                  "-"
                }
              />
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={
            onClose
          }
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Detail({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <Box>
      <Typography
        sx={{
          color:
            "text.secondary",

          fontSize:
            "0.68rem",
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          mt:
            0.4,

          fontSize:
            "0.79rem",

          fontWeight:
            650,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}