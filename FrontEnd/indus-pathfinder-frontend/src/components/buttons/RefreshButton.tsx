import {
    RefreshRounded,
  } from "@mui/icons-material";
  
  import {
    IconButton,
    Tooltip,
  } from "@mui/material";
  
  interface RefreshButtonProps {
    onRefresh: () => void;
    disabled?: boolean;
  }
  
  export default function RefreshButton({
    onRefresh,
    disabled = false,
  }: RefreshButtonProps) {
    return (
      <Tooltip title="Refresh">
        <span>
          <IconButton
            disabled={disabled}
            onClick={onRefresh}
            sx={{
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <RefreshRounded />
          </IconButton>
        </span>
      </Tooltip>
    );
  }