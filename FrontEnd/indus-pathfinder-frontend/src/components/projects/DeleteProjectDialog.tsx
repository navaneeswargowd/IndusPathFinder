import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import type {
  ProjectSearchResponse,
} from "../../types/project.types";

import PrimaryButton from "../buttons/PrimaryButton";

interface DeleteProjectDialogProps {
  project:
    ProjectSearchResponse | null;

  open: boolean;

  loading: boolean;

  onClose:
    () => void;

  onConfirm:
    () => void;
}

export default function DeleteProjectDialog({
  project,
  open,
  loading,
  onClose,
  onConfirm,
}: DeleteProjectDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={
        loading
          ? undefined
          : onClose
      }
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>
        Delete Project?
      </DialogTitle>

      <DialogContent>
        <Typography
          sx={{
            color:
              "text.secondary",

            lineHeight:
              1.7,

            fontSize:
              "0.85rem",
          }}
        >
          Are you sure you want to
          delete{" "}
          <strong>
            {project?.projectCode}{" "}
            {project?.projectName}
          </strong>
          ? This action cannot be
          undone.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          color="inherit"
          disabled={loading}
          onClick={onClose}
        >
          Cancel
        </Button>

        <PrimaryButton
          color="error"
          loading={loading}
          onClick={onConfirm}
        >
          Delete Project
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}