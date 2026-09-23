import {
    Chip,
  } from "@mui/material";
  
  type StatusType =
    | "ACTIVE"
    | "INACTIVE"
    | "PLANNED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "PENDING"
    | "READ"
    | "UNREAD";
  
  interface StatusBadgeProps {
    status: string;
  }
  
  export default function StatusBadge({
    status,
  }: StatusBadgeProps) {
    const normalizedStatus =
      status.toUpperCase() as StatusType;
  
    const statusConfig = {
      ACTIVE: {
        label: "Active",
        color: "success" as const,
      },
  
      INACTIVE: {
        label: "Inactive",
        color: "default" as const,
      },
  
      PLANNED: {
        label: "Planned",
        color: "info" as const,
      },
  
      IN_PROGRESS: {
        label: "In Progress",
        color: "warning" as const,
      },
  
      COMPLETED: {
        label: "Completed",
        color: "success" as const,
      },
  
      PENDING: {
        label: "Pending",
        color: "warning" as const,
      },
  
      READ: {
        label: "Read",
        color: "default" as const,
      },
  
      UNREAD: {
        label: "Unread",
        color: "info" as const,
      },
    };
  
    const config =
      statusConfig[normalizedStatus] ?? {
        label: status,
        color: "default" as const,
      };
  
    return (
      <Chip
        size="small"
        label={config.label}
        color={config.color}
        variant="outlined"
        sx={{
          fontWeight: 650,
  
          fontSize: "0.72rem",
  
          borderRadius: 2,
        }}
      />
    );
  }