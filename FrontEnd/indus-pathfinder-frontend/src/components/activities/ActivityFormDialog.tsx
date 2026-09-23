import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import {
  CloseRounded,
} from "@mui/icons-material";

import {
  Controller,
  useForm,
} from "react-hook-form";

import {
  useEffect,
} from "react";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  activitySchema,
  type ActivityFormValues,
} from "../../schemas/activity.schema";

import {
  ActivityPriority,
  ActivityStatus,
} from "../../enums/activity.enums";

import type {
  ActivitySearchResponse,
} from "../../types/activity.types";

import {
  allowAddressInput,
  allowNameInput,
} from "../../utils/validation.utils";

import PrimaryButton
  from "../buttons/PrimaryButton";


interface ActivityFormDialogProps {
  open:
    boolean;

  loading:
    boolean;

  activity:
    ActivitySearchResponse | null;

  projectStartDate:
    string;

  projectEndDate:
    string;

  onClose:
    () => void;

  onSubmit:
    (
      values:
        ActivityFormValues
    ) => void;
}


/*
 * ============================================================
 * COMMON HELPER TEXT STYLE
 * ============================================================
 *
 * Only validation message becomes red.
 *
 * Border, label and placeholder
 * remain normal.
 */

const helperTextSx = (
  hasError:
    boolean
) => ({
  color:
    hasError
      ? "error.main"
      : "transparent",

  fontSize:
    "0.72rem",

  mt:
    0.5,

  ml:
    0.2,
});


export default function ActivityFormDialog({
  open,
  loading,
  activity,
  projectStartDate,
  projectEndDate,
  onClose,
  onSubmit,
}: ActivityFormDialogProps) {

  const isEdit =
    Boolean(
      activity
    );


  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
  } =
    useForm<ActivityFormValues>({
      resolver:
        zodResolver(
          activitySchema
        ),

      defaultValues: {
        actName:
          "",

        description:
          "",

        duration:
          1,

        startDate:
          "",

        endDate:
          "",

        priority:
          ActivityPriority.MEDIUM,

        status:
          ActivityStatus.NOT_STARTED,
      },

      mode:
        "onTouched",
    });


  /*
   * ============================================================
   * WATCH ACTIVITY DATES
   * ============================================================
   */

  const startDate =
    watch(
      "startDate"
    );

  const endDate =
    watch(
      "endDate"
    );


  /*
   * ============================================================
   * MINIMUM ACTIVITY END DATE
   * ============================================================
   *
   * End Date must be strictly AFTER
   * Activity Start Date.
   *
   * Example:
   *
   * Start Date = 2026-09-10
   *
   * Earliest End Date =
   * 2026-09-11
   */

  let minimumActivityEndDate =
    "";

  if (
    startDate
  ) {

    const selectedStartDate =
      new Date(
        `${startDate}T00:00:00`
      );

    selectedStartDate.setDate(
      selectedStartDate.getDate() + 1
    );

    minimumActivityEndDate =
      [
        selectedStartDate.getFullYear(),

        String(
          selectedStartDate.getMonth() + 1
        ).padStart(
          2,
          "0"
        ),

        String(
          selectedStartDate.getDate()
        ).padStart(
          2,
          "0"
        ),
      ].join("-");
  }


  /*
   * ==========================================================
   * RESET CREATE / EDIT FORM
   * ==========================================================
   */

  useEffect(
    () => {

      if (
        activity
      ) {

        reset({
          actName:
            activity.actName,

          description:
            activity.description ??
            "",

          duration:
            activity.duration,

          startDate:
            activity.startDate,

          endDate:
            activity.endDate,

          priority:
            activity.priority,

          status:
            activity.status,
        });

        return;
      }


      reset({
        actName:
          "",

        description:
          "",

        duration:
          1,

        startDate:
          "",

        endDate:
          "",

        priority:
          ActivityPriority.MEDIUM,

        status:
          ActivityStatus.NOT_STARTED,
      });

    },
    [
      activity,
      open,
      reset,
    ]
  );


  /*
   * ==========================================================
   * CLEAR INVALID END DATE
   * ==========================================================
   *
   * Example:
   *
   * Activity Start = 10 Sep
   * Activity End   = 15 Sep
   *
   * User changes Start = 20 Sep
   *
   * Existing End = 15 Sep is now invalid.
   *
   * Therefore End Date is cleared.
   */

  useEffect(
    () => {

      if (
        !startDate ||
        !endDate
      ) {
        return;
      }


      if (
        endDate <=
        startDate
      ) {

        setValue(
          "endDate",
          "",
          {
            shouldValidate:
              true,

            shouldDirty:
              true,
          }
        );
      }

    },
    [
      startDate,
      endDate,
      setValue,
    ]
  );


  /*
   * ==========================================================
   * AUTOMATIC DURATION
   * ==========================================================
   */

  useEffect(
    () => {

      if (
        !startDate ||
        !endDate
      ) {
        return;
      }


      const start =
        new Date(
          `${startDate}T00:00:00`
        );

      const end =
        new Date(
          `${endDate}T00:00:00`
        );


      /*
       * Do not calculate duration
       * for invalid dates.
       */
      if (
        end <=
        start
      ) {
        return;
      }


      const milliseconds =
        end.getTime() -
        start.getTime();


      /*
       * Inclusive duration.
       *
       * Example:
       *
       * Start = 10 Sep
       * End   = 11 Sep
       *
       * Duration = 2 days
       */
      const calculatedDuration =
        Math.floor(
          milliseconds /
          86_400_000
        ) + 1;


      setValue(
        "duration",
        calculatedDuration,
        {
          shouldValidate:
            true,
        }
      );

    },
    [
      startDate,
      endDate,
      setValue,
    ]
  );


  /*
   * ==========================================================
   * SUBMIT
   * ==========================================================
   */

  const submitForm =
    (
      values:
        ActivityFormValues
    ) => {

      /*
       * ------------------------------------------
       * START DATE < PROJECT START DATE
       * ------------------------------------------
       */

      if (
        values.startDate <
        projectStartDate
      ) {

        setError(
          "startDate",
          {
            message:
              "Activity Start Date must be within the Project dates",
          }
        );

        return;
      }


      /*
       * ------------------------------------------
       * START DATE > PROJECT END DATE
       * ------------------------------------------
       */

      if (
        values.startDate >
        projectEndDate
      ) {

        setError(
          "startDate",
          {
            message:
              "Activity Start Date must be within the Project dates",
          }
        );

        return;
      }


      /*
       * ------------------------------------------
       * END DATE <= ACTIVITY START DATE
       * ------------------------------------------
       *
       * End Date must be strictly after
       * Activity Start Date.
       */

      if (
        values.endDate <=
        values.startDate
      ) {

        setError(
          "endDate",
          {
            message:
              "Activity End Date must be after Activity Start Date",
          }
        );

        return;
      }


      /*
       * ------------------------------------------
       * END DATE > PROJECT END DATE
       * ------------------------------------------
       */

      if (
        values.endDate >
        projectEndDate
      ) {

        setError(
          "endDate",
          {
            message:
              "Activity End Date must be within the Project dates",
          }
        );

        return;
      }


      /*
       * ------------------------------------------
       * END DATE < PROJECT START DATE
       * ------------------------------------------
       *
       * Additional safety check.
       */

      if (
        values.endDate <
        projectStartDate
      ) {

        setError(
          "endDate",
          {
            message:
              "Activity End Date must be within the Project dates",
          }
        );

        return;
      }


      onSubmit(
        values
      );
    };


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

      maxWidth="md"
    >

      {/* ==================================================== */}
      {/* TITLE */}
      {/* ==================================================== */}

      <DialogTitle
        sx={{
          px:
            3,

          py:
            2.5,

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          borderBottom:
            "1px solid",

          borderColor:
            "divider",
        }}
      >
        <Box>

          <Typography
            sx={{
              fontSize:
                "1.05rem",

              fontWeight:
                750,
            }}
          >
            {isEdit
              ? "Edit Activity"
              : "Add Activity"}
          </Typography>


          <Typography
            sx={{
              mt:
                0.25,

              color:
                "text.secondary",

              fontSize:
                "0.72rem",
            }}
          >
            {isEdit
              ? "Update activity schedule and status."
              : "Create a new activity inside this project."}
          </Typography>

        </Box>


        <Button
          disabled={
            loading
          }

          onClick={
            onClose
          }

          sx={{
            minWidth:
              38,

            width:
              38,

            height:
              38,
          }}
        >
          <CloseRounded />
        </Button>

      </DialogTitle>


      {/* ==================================================== */}
      {/* FORM */}
      {/* ==================================================== */}

      <Box
        component="form"

        noValidate

        onSubmit={
          handleSubmit(
            submitForm
          )
        }
      >

        <DialogContent
          sx={{
            p:
              3,
          }}
        >

          <Box
            sx={{
              display:
                "grid",

              gap:
                2.2,
            }}
          >

            {/* ================================================= */}
            {/* ACTIVITY NAME */}
            {/* ================================================= */}

            <Controller
              name="actName"

              control={
                control
              }

              render={({
                field,
                fieldState,
              }) => (

                <TextField
                  {...field}

                  fullWidth

                  autoFocus

                  label="Activity Name *"

                  placeholder="Example: Site Mobilization"

                  onChange={(
                    event
                  ) => {

                    const value =
                      event.target.value;


                    /*
                     * Reject invalid
                     * characters immediately.
                     */

                    if (
                      !allowNameInput(
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
                   * Only error message
                   * becomes red.
                   */
                  error={
                    false
                  }

                  helperText={
                    fieldState.error
                      ?.message ??
                    " "
                  }

                  slotProps={{
                    htmlInput: {
                      maxLength:
                        100,
                    },

                    formHelperText: {
                      sx:
                        helperTextSx(
                          Boolean(
                            fieldState.error
                          )
                        ),
                    },
                  }}

                  sx={{
                    "& .MuiInputBase-input::placeholder":
                      {
                        color:
                          "text.secondary",

                        opacity:
                          0.7,
                      },
                  }}
                />

              )}
            />


            {/* ================================================= */}
            {/* DESCRIPTION */}
            {/* ================================================= */}

            <Controller
              name="description"

              control={
                control
              }

              render={({
                field,
                fieldState,
              }) => (

                <TextField
                  {...field}

                  fullWidth

                  multiline

                  minRows={
                    3
                  }

                  label="Description"

                  placeholder="Describe the activity..."

                  onChange={(
                    event
                  ) => {

                    const value =
                      event.target.value;


                    if (
                      !allowAddressInput(
                        value
                      )
                    ) {
                      return;
                    }


                    field.onChange(
                      value
                    );
                  }}

                  error={
                    false
                  }

                  helperText={
                    fieldState.error
                      ?.message ??
                    " "
                  }

                  slotProps={{
                    htmlInput: {
                      maxLength:
                        500,
                    },

                    formHelperText: {
                      sx:
                        helperTextSx(
                          Boolean(
                            fieldState.error
                          )
                        ),
                    },
                  }}

                  sx={{
                    "& .MuiInputBase-input::placeholder":
                      {
                        color:
                          "text.secondary",

                        opacity:
                          0.7,
                      },
                  }}
                />

              )}
            />


            {/* ================================================= */}
            {/* SCHEDULE */}
            {/* ================================================= */}

            <Box
              sx={{
                display:
                  "grid",

                gridTemplateColumns: {
                  xs:
                    "1fr",

                  sm:
                    "repeat(2, minmax(0, 1fr))",
                },

                gap:
                  2,
              }}
            >

              {/* ============================================= */}
              {/* ACTIVITY START DATE */}
              {/* ============================================= */}

              <Controller
                name="startDate"

                control={
                  control
                }

                render={({
                  field,
                  fieldState,
                }) => (

                  <TextField
                    {...field}

                    fullWidth

                    type="date"

                    label="Start Date *"

                    error={
                      false
                    }

                    helperText={
                      fieldState.error
                        ?.message ??
                      " "
                    }

                    slotProps={{
                      inputLabel: {
                        shrink:
                          true,
                      },

                      /*
                       * Activity Start Date:
                       *
                       * Minimum =
                       * Project Start Date
                       *
                       * Maximum =
                       * Project End Date
                       */
                      htmlInput: {
                        min:
                          projectStartDate,

                        max:
                          projectEndDate,
                      },

                      formHelperText: {
                        sx:
                          helperTextSx(
                            Boolean(
                              fieldState.error
                            )
                          ),
                      },
                    }}
                  />

                )}
              />


              {/* ============================================= */}
              {/* ACTIVITY END DATE */}
              {/* ============================================= */}

              <Controller
                name="endDate"

                control={
                  control
                }

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
                     * End Date cannot be selected
                     * before Activity Start Date
                     * has been selected.
                     */
                    disabled={
                      !startDate
                    }

                    error={
                      false
                    }

                    helperText={
                      fieldState.error
                        ?.message ??
                      " "
                    }

                    slotProps={{
                      inputLabel: {
                        shrink:
                          true,
                      },

                      /*
                       * Activity End Date:
                       *
                       * Minimum =
                       * Activity Start Date + 1 day
                       *
                       * Maximum =
                       * Project End Date
                       */
                      htmlInput: {
                        min:
                          minimumActivityEndDate,

                        max:
                          projectEndDate,
                      },

                      formHelperText: {
                        sx:
                          helperTextSx(
                            Boolean(
                              fieldState.error
                            )
                          ),
                      },
                    }}
                  />

                )}
              />


              {/* ============================================= */}
              {/* DURATION */}
              {/* ============================================= */}

              <Controller
                name="duration"

                control={
                  control
                }

                render={({
                  field,
                  fieldState,
                }) => (

                  <TextField
                    {...field}

                    fullWidth

                    type="number"

                    label="Duration (Days) *"

                    disabled

                    value={
                      field.value
                    }

                    error={
                      false
                    }

                    helperText={
                      fieldState.error
                        ?.message ??
                      "Automatically calculated from the selected dates."
                    }

                    slotProps={{
                      formHelperText: {
                        sx: {
                          color:
                            fieldState.error
                              ? "error.main"
                              : "text.secondary",

                          fontSize:
                            "0.72rem",

                          mt:
                            0.5,

                          ml:
                            0.2,
                        },
                      },
                    }}
                  />

                )}
              />


              <Box />


              {/* ============================================= */}
              {/* PRIORITY */}
              {/* ============================================= */}

              <Controller
                name="priority"

                control={
                  control
                }

                render={({
                  field,
                  fieldState,
                }) => (

                  <TextField
                    {...field}

                    select

                    fullWidth

                    label="Priority *"

                    error={
                      false
                    }

                    helperText={
                      fieldState.error
                        ?.message ??
                      " "
                    }

                    slotProps={{
                      formHelperText: {
                        sx:
                          helperTextSx(
                            Boolean(
                              fieldState.error
                            )
                          ),
                      },
                    }}
                  >

                    <MenuItem
                      value={
                        ActivityPriority.LOW
                      }
                    >
                      Low
                    </MenuItem>


                    <MenuItem
                      value={
                        ActivityPriority.MEDIUM
                      }
                    >
                      Medium
                    </MenuItem>


                    <MenuItem
                      value={
                        ActivityPriority.HIGH
                      }
                    >
                      High
                    </MenuItem>

                  </TextField>

                )}
              />


              {/* ============================================= */}
              {/* STATUS */}
              {/* ============================================= */}

              <Controller
                name="status"

                control={
                  control
                }

                render={({
                  field,
                  fieldState,
                }) => (

                  <TextField
                    {...field}

                    select

                    fullWidth

                    label="Status *"

                    error={
                      false
                    }

                    helperText={
                      fieldState.error
                        ?.message ??
                      " "
                    }

                    slotProps={{
                      formHelperText: {
                        sx:
                          helperTextSx(
                            Boolean(
                              fieldState.error
                            )
                          ),
                      },
                    }}
                  >

                    <MenuItem
                      value={
                        ActivityStatus.NOT_STARTED
                      }
                    >
                      Not Started
                    </MenuItem>


                    <MenuItem
                      value={
                        ActivityStatus.IN_PROGRESS
                      }
                    >
                      In Progress
                    </MenuItem>


                    <MenuItem
                      value={
                        ActivityStatus.COMPLETED
                      }
                    >
                      Completed
                    </MenuItem>

                  </TextField>

                )}
              />

            </Box>

          </Box>

        </DialogContent>


        {/* ================================================== */}
        {/* ACTIONS */}
        {/* ================================================== */}

        <DialogActions
          sx={{
            px:
              3,

            py:
              2,

            borderTop:
              "1px solid",

            borderColor:
              "divider",
          }}
        >

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


          <PrimaryButton
            type="submit"

            loading={
              loading
            }
          >
            {isEdit
              ? "Save Changes"
              : "Add Activity"}
          </PrimaryButton>

        </DialogActions>

      </Box>

    </Dialog>
  );
}