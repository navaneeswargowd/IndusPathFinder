import type {
    ButtonProps,
  } from "@mui/material";
  
  import {
    Button,
    CircularProgress,
  } from "@mui/material";
  
  interface PrimaryButtonProps
    extends ButtonProps {
    loading?: boolean;
  }
  
  export default function PrimaryButton({
    loading = false,
    disabled,
    children,
    ...props
  }: PrimaryButtonProps) {
    return (
      <Button
        variant="contained"
        disabled={disabled || loading}
        {...props}
        sx={{
          minHeight: 44,
  
          background:
            "linear-gradient(135deg, #173B73, #176B9D)",
  
          "&:hover": {
            background:
              "linear-gradient(135deg, #102E5D, #125B86)",
          },
  
          ...props.sx,
        }}
      >
        {loading ? (
          <CircularProgress
            size={20}
            color="inherit"
          />
        ) : (
          children
        )}
      </Button>
    );
  }