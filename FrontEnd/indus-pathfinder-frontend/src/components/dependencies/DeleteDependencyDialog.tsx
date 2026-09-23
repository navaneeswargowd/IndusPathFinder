import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import type {
  DependencySearchResponse,
} from "../../types/dependency.types";

interface DeleteDependencyDialogProps {
  dependency:
    DependencySearchResponse | null;

  open:
    boolean;

  loading:
    boolean;

  onClose:
    () => void;

  onConfirm:
    () => void;
}

export default function DeleteDependencyDialog({
  dependency,
  open,
  loading,
  onClose,
  onConfirm,
}: DeleteDependencyDialogProps) {
  return (
    <Dialog
      open={
        open
      }
      onClose={
        loading
          ? undefined
          : onClose
      }
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>
        Delete Dependency?
      </DialogTitle>

      <DialogContent>
        <Typography
          sx={{
            color:
              "text.secondary",

            lineHeight:
              1.7,
          }}
        >
          Delete the dependency between{" "}
          <strong>
            {
              dependency
                ?.predecessorActivityName
            }
          </strong>{" "}
          and{" "}
          <strong>
            {
              dependency
                ?.successorActivityName
            }
          </strong>
          ? This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          disabled={
            loading
          }
          onClick={
            onClose
          }
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          disabled={
            loading
          }
          onClick={
            onConfirm
          }
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}