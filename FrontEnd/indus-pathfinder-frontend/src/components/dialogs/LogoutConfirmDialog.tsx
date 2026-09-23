import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import {
  LogoutRounded,
} from "@mui/icons-material";

import PrimaryButton from "../buttons/PrimaryButton";

interface LogoutConfirmDialogProps {
  open: boolean;

  loading?: boolean;

  onClose: () => void;

  onConfirm: () => void;
}

export default function LogoutConfirmDialog({
  open,
  loading = false,
  onClose,
  onConfirm,
}: LogoutConfirmDialogProps) {
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
      <DialogTitle
        sx={{
          fontWeight: 750,
        }}
      >
        Sign out?
      </DialogTitle>

      <DialogContent>
        <Typography
          sx={{
            color:
              "text.secondary",

            fontSize:
              "0.87rem",

            lineHeight: 1.7,
          }}
        >
          You will be signed out of your
          IndusPathFinder workspace and
          returned to the login page.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2.5,
        }}
      >
        <Button
          color="inherit"
          disabled={loading}
          onClick={onClose}
        >
          Cancel
        </Button>

        <PrimaryButton
          loading={loading}
          onClick={onConfirm}
          startIcon={
            !loading
              ? <LogoutRounded />
              : undefined
          }
        >
          Sign Out
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}