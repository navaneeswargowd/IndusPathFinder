import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import type {
  ActivitySearchResponse,
} from "../../types/activity.types";

interface DeleteActivityDialogProps {
  activity:
    ActivitySearchResponse | null;

  open:
    boolean;

  loading:
    boolean;

  onClose:
    () => void;

  onConfirm:
    () => void;
}

export default function DeleteActivityDialog({
  activity,
  open,
  loading,
  onClose,
  onConfirm,
}: DeleteActivityDialogProps) {
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
        Delete Activity?
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
          Delete{" "}
          <strong>
            {
              activity?.actCode
            }{" "}
            {
              activity?.actName
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