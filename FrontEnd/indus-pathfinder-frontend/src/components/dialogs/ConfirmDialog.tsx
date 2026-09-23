import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from "@mui/material";
  
  import PrimaryButton from "../buttons/PrimaryButton";
  
  interface ConfirmDialogProps {
    open: boolean;
  
    title: string;
  
    message: string;
  
    confirmText?: string;
  
    cancelText?: string;
  
    loading?: boolean;
  
    danger?: boolean;
  
    onConfirm: () => void;
  
    onClose: () => void;
  }
  
  export default function ConfirmDialog({
    open,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
    danger = false,
    onConfirm,
    onClose,
  }: ConfirmDialogProps) {
    return (
      <Dialog
        open={open}
        onClose={
          loading ? undefined : onClose
        }
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
          }}
        >
          {title}
        </DialogTitle>
  
        <DialogContent>
          <DialogContentText>
            {message}
          </DialogContentText>
        </DialogContent>
  
        <DialogActions
          sx={{
            px: 3,
            pb: 2.5,
          }}
        >
          <Button
            onClick={onClose}
            disabled={loading}
            color="inherit"
          >
            {cancelText}
          </Button>
  
          {danger ? (
            <Button
              variant="contained"
              color="error"
              onClick={onConfirm}
              disabled={loading}
            >
              {confirmText}
            </Button>
          ) : (
            <PrimaryButton
              loading={loading}
              onClick={onConfirm}
            >
              {confirmText}
            </PrimaryButton>
          )}
        </DialogActions>
      </Dialog>
    );
  }