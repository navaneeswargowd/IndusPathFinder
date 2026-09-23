import {
  Box,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";

import {
  RefreshRounded,
  SearchRounded,
} from "@mui/icons-material";

import {
  ProjectPriority,
  ProjectStatus,
} from "../../enums/project.enums";

export interface ProjectFilterValues {
  projectCode: string;

  projectName: string;

  status: string;

  priority: string;
}

interface ProjectFiltersProps {
  values:
    ProjectFilterValues;

  loading?: boolean;

  onChange: (
    field:
      keyof ProjectFilterValues,
    value: string
  ) => void;

  onSearch:
    () => void;

  onReset:
    () => void;
}

export default function ProjectFilters({
  values,
  loading = false,
  onChange,
  onSearch,
  onReset,
}: ProjectFiltersProps) {
  return (
    <Box
      sx={{
        display:
          "grid",

        gridTemplateColumns: {
          xs:
            "1fr",

          md:
            "repeat(2, minmax(0, 1fr))",

          xl:
            "repeat(4, minmax(0, 1fr)) auto",
        },

        gap: 1.5,

        alignItems:
          "center",
      }}
    >
      <TextField
        size="small"
        label="Project Code"
        value={
          values.projectCode
        }
        onChange={(
          event
        ) =>
          onChange(
            "projectCode",
            event.target.value
          )
        }
      />

      <TextField
        size="small"
        label="Project Name"
        value={
          values.projectName
        }
        onChange={(
          event
        ) =>
          onChange(
            "projectName",
            event.target.value
          )
        }
      />

      <TextField
        select
        size="small"
        label="Status"
        value={
          values.status
        }
        onChange={(
          event
        ) =>
          onChange(
            "status",
            event.target.value
          )
        }
      >
        <MenuItem value="">
          All Statuses
        </MenuItem>

        <MenuItem
          value={
            ProjectStatus.ACTIVE
          }
        >
          Active
        </MenuItem>

        <MenuItem
          value={
            ProjectStatus.INACTIVE
          }
        >
          Inactive
        </MenuItem>

        <MenuItem
          value={
            ProjectStatus.COMPLETED
          }
        >
          Completed
        </MenuItem>
      </TextField>

      <TextField
        select
        size="small"
        label="Priority"
        value={
          values.priority
        }
        onChange={(
          event
        ) =>
          onChange(
            "priority",
            event.target.value
          )
        }
      >
        <MenuItem value="">
          All Priorities
        </MenuItem>

        <MenuItem
          value={
            ProjectPriority.LOW
          }
        >
          Low
        </MenuItem>

        <MenuItem
          value={
            ProjectPriority.MEDIUM
          }
        >
          Medium
        </MenuItem>

        <MenuItem
          value={
            ProjectPriority.HIGH
          }
        >
          High
        </MenuItem>
      </TextField>

      <Box
        sx={{
          display:
            "flex",

          gap: 1,
        }}
      >
        <Button
          variant="contained"
          startIcon={
            <SearchRounded />
          }
          disabled={loading}
          onClick={
            onSearch
          }
        >
          Search
        </Button>

        <Button
          variant="outlined"
          startIcon={
            <RefreshRounded />
          }
          disabled={loading}
          onClick={
            onReset
          }
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
}