import {
  Box,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import {
  CalendarMonthOutlined,
  FlagOutlined,
  FolderOutlined,
} from "@mui/icons-material";

import {
  Controller,
  useWatch,
  type Control,
} from "react-hook-form";

import {
  ProjectPriority,
  ProjectStatus,
} from "../../enums/project.enums";

import type {
  ProjectFormValues,
} from "../../schemas/project.schema";

import {
  allowProjectNameInput,
  allowProjectDescriptionInput,
} from "../../utils/validation.utils";

import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";


interface ProjectFormProps {
  control:
    Control<
      ProjectFormValues,
      any,
      any
    >;

  submitting:
    boolean;

  submitLabel:
    string;

  onCancel:
    () => void;
}


export default function ProjectForm({
  control,
  submitting,
  submitLabel,
  onCancel,
}: ProjectFormProps) {

  /*
   * Watch Start Date.
   *
   * End Date restriction depends
   * only on the selected Start Date.
   */
  const selectedStartDate =
    useWatch({
      control,
      name: "startDate",
    });


  /*
   * Calculate minimum End Date.
   *
   * End Date must be strictly
   * AFTER Start Date.
   *
   * Example:
   *
   * Start Date = 2026-09-10
   * End Date minimum = 2026-09-11
   */
  let minimumEndDate = "";

  if (selectedStartDate) {

    const startDate =
      new Date(
        `${selectedStartDate}T00:00:00`
      );

    startDate.setDate(
      startDate.getDate() + 1
    );

    minimumEndDate =
      [
        startDate.getFullYear(),

        String(
          startDate.getMonth() + 1
        ).padStart(2, "0"),

        String(
          startDate.getDate()
        ).padStart(2, "0"),
      ].join("-");
  }


  return (
    <Box>

      {/* ============================== */}
      {/* BASIC INFORMATION */}
      {/* ============================== */}

      <SectionHeader
        icon={
          <FolderOutlined />
        }
        title="Basic Information"
        description="Enter the project name and a short description."
      />

      <Box
        sx={{
          mt: 2,

          display:
            "grid",

          gap: 2,
        }}
      >

        {/* ============================== */}
        {/* PROJECT NAME */}
        {/* ============================== */}

        <Controller
          name="projectName"
          control={control}
          render={({
            field,
            fieldState,
          }) => (
            <TextField
              {...field}

              fullWidth

              autoFocus

              label="Project Name *"

              placeholder="Example: ERP System Modernization"

              onChange={(event) => {

                const value =
                  event.target.value;

                /*
                 * Allow only:
                 *
                 * letters
                 * numbers
                 * approved special characters
                 * single spaces
                 *
                 * Block:
                 *
                 * leading spaces
                 * consecutive spaces
                 * emoji
                 * unwanted characters
                 */
                if (
                  !allowProjectNameInput(
                    value
                  )
                ) {
                  return;
                }

                field.onChange(
                  value
                );
              }}

              /*
               * Do not show red border,
               * red label or red placeholder.
               *
               * Only helper error message
               * will be red.
               */
              error={false}

              helperText={
                fieldState.error
                  ?.message ?? " "
              }

              slotProps={{
                htmlInput: {
                  maxLength: 100,
                },

                formHelperText: {
                  sx: {
                    color:
                      fieldState.error
                        ? "error.main"
                        : "transparent",

                    fontSize:
                      "0.72rem",

                    mt: 0.5,

                    ml: 0.2,
                  },
                },
              }}
            />
          )}
        />


        {/* ============================== */}
        {/* DESCRIPTION */}
        {/* ============================== */}

        <Controller
          name="description"
          control={control}
          render={({
            field,
            fieldState,
          }) => (
            <TextField
              {...field}

              fullWidth

              label="Description"

              placeholder="Describe the purpose and scope of the project..."

              multiline

              minRows={3}

              onChange={(event) => {

                const value =
                  event.target.value;

                /*
                 * Allow:
                 *
                 * letters
                 * numbers
                 * approved punctuation
                 * single spaces
                 * line breaks
                 *
                 * Block:
                 *
                 * leading spaces
                 * consecutive spaces
                 * emoji
                 * unwanted characters
                 */
                if (
                  !allowProjectDescriptionInput(
                    value
                  )
                ) {
                  return;
                }

                field.onChange(
                  value
                );
              }}

              error={false}

              helperText={
                fieldState.error
                  ?.message ?? " "
              }

              slotProps={{
                htmlInput: {
                  maxLength: 500,
                },

                formHelperText: {
                  sx: {
                    color:
                      fieldState.error
                        ? "error.main"
                        : "transparent",

                    fontSize:
                      "0.72rem",

                    mt: 0.5,

                    ml: 0.2,
                  },
                },
              }}
            />
          )}
        />
      </Box>


      {/* ============================== */}
      {/* PROJECT SCHEDULE */}
      {/* ============================== */}

      <Box
        sx={{
          mt: 3.5,
        }}
      >
        <SectionHeader
          icon={
            <CalendarMonthOutlined />
          }
          title="Project Schedule"
          description="Define the planned project start and end dates."
        />
      </Box>

      <Box
        sx={{
          mt: 2,

          display:
            "grid",

          gridTemplateColumns: {
            xs:
              "1fr",

            sm:
              "repeat(2, minmax(0, 1fr))",
          },

          gap: 2,
        }}
      >

        {/* ============================== */}
        {/* START DATE */}
        {/* ============================== */}

        <Controller
          name="startDate"
          control={control}
          render={({
            field,
            fieldState,
          }) => (
            <TextField
              {...field}

              fullWidth

              type="date"

              label="Start Date *"

              /*
               * IMPORTANT:
               *
               * There is NO min date.
               *
               * User can select:
               *
               * past date
               * today's date
               * future date
               */
              error={false}

              helperText={
                fieldState.error
                  ?.message ?? " "
              }

              slotProps={{
                inputLabel: {
                  shrink: true,
                },

                formHelperText: {
                  sx: {
                    color:
                      fieldState.error
                        ? "error.main"
                        : "transparent",

                    fontSize:
                      "0.72rem",

                    mt: 0.5,

                    ml: 0.2,
                  },
                },
              }}
            />
          )}
        />


        {/* ============================== */}
        {/* END DATE */}
        {/* ============================== */}

        <Controller
          name="endDate"
          control={control}
          render={({
            field,
            fieldState,
          }) => (
            <TextField
              {...field}

              fullWidth

              type="date"

              label="End Date *"

              /*
               * Until Start Date is
               * selected, End Date
               * cannot be selected.
               */
              disabled={
                !selectedStartDate
              }

              error={false}

              helperText={
                fieldState.error
                  ?.message ?? " "
              }

              slotProps={{
                inputLabel: {
                  shrink: true,
                },

                /*
                 * Restrict End Date
                 * based only on Start Date.
                 *
                 * Example:
                 *
                 * Start = 2026-09-10
                 *
                 * 2026-09-09 -> blocked
                 * 2026-09-10 -> blocked
                 * 2026-09-11 -> allowed
                 */
                htmlInput: {
                  min:
                    minimumEndDate,
                },

                formHelperText: {
                  sx: {
                    color:
                      fieldState.error
                        ? "error.main"
                        : "transparent",

                    "&.Mui-disabled": {
                      color:
                        fieldState.error
                          ? "error.main"
                          : "transparent",
                    },

                    fontSize:
                      "0.72rem",

                    mt: 0.5,

                    ml: 0.2,
                  },
                },
              }}
            />
          )}
        />
      </Box>


      {/* ============================== */}
      {/* PROJECT CLASSIFICATION */}
      {/* ============================== */}

      <Box
        sx={{
          mt: 3.5,
        }}
      >
        <SectionHeader
          icon={
            <FlagOutlined />
          }
          title="Project Classification"
          description="Set the project status and planning priority."
        />
      </Box>

      <Box
        sx={{
          mt: 2,

          display:
            "grid",

          gridTemplateColumns: {
            xs:
              "1fr",

            sm:
              "repeat(2, minmax(0, 1fr))",
          },

          gap: 2,
        }}
      >

        {/* ============================== */}
        {/* STATUS */}
        {/* ============================== */}

        <Controller
          name="status"
          control={control}
          render={({
            field,
            fieldState,
          }) => (
            <TextField
              {...field}

              select

              fullWidth

              label="Status *"

              error={false}

              helperText={
                fieldState.error
                  ?.message ?? " "
              }

              slotProps={{
                formHelperText: {
                  sx: {
                    color:
                      fieldState.error
                        ? "error.main"
                        : "transparent",

                    fontSize:
                      "0.72rem",

                    mt: 0.5,

                    ml: 0.2,
                  },
                },
              }}
            >
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
          )}
        />


        {/* ============================== */}
        {/* PRIORITY */}
        {/* ============================== */}

        <Controller
          name="priority"
          control={control}
          render={({
            field,
            fieldState,
          }) => (
            <TextField
              {...field}

              select

              fullWidth

              label="Priority *"

              error={false}

              helperText={
                fieldState.error
                  ?.message ?? " "
              }

              slotProps={{
                formHelperText: {
                  sx: {
                    color:
                      fieldState.error
                        ? "error.main"
                        : "transparent",

                    fontSize:
                      "0.72rem",

                    mt: 0.5,

                    ml: 0.2,
                  },
                },
              }}
            >
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
          )}
        />
      </Box>


      {/* ============================== */}
      {/* ACTION BUTTONS */}
      {/* ============================== */}

      <Box
        sx={{
          mt: 4,

          pt: 2.5,

          borderTop:
            "1px solid",

          borderColor:
            "divider",

          display:
            "flex",

          justifyContent:
            "flex-end",

          flexWrap:
            "wrap",

          gap: 1.2,
        }}
      >
        <SecondaryButton
          type="button"
          disabled={
            submitting
          }
          onClick={
            onCancel
          }
        >
          Cancel
        </SecondaryButton>

        <PrimaryButton
          type="submit"
          loading={
            submitting
          }
        >
          {submitLabel}
        </PrimaryButton>
      </Box>
    </Box>
  );
}


/*
 * ============================================================
 * SECTION HEADER
 * ============================================================
 */

interface SectionHeaderProps {
  icon:
    React.ReactNode;

  title:
    string;

  description:
    string;
}


function SectionHeader({
  icon,
  title,
  description,
}: SectionHeaderProps) {

  return (
    <Box
      sx={{
        display:
          "flex",

        alignItems:
          "center",

        gap: 1.2,
      }}
    >
      <Box
        sx={{
          width: 38,

          height: 38,

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",

          flexShrink:
            0,

          borderRadius:
            2,

          color:
            "primary.main",

          background:
            "linear-gradient(135deg, rgba(23,59,115,0.08), rgba(13,146,184,0.10))",

          "& svg": {
            fontSize: 19,
          },
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          sx={{
            fontWeight:
              720,

            fontSize:
              "0.86rem",

            color:
              "#10233E",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.15,

            color:
              "text.secondary",

            fontSize:
              "0.69rem",
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
}