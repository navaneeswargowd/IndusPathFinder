// import {
//   LockResetRounded,
// } from "@mui/icons-material";

// import {
//   Box,
//   Paper,
//   TextField,
//   Typography,
// } from "@mui/material";

// import {
//   Controller,
//   useForm,
// } from "react-hook-form";

// import {
//   zodResolver,
// } from "@hookform/resolvers/zod";

// import {
//   useMutation,
// } from "@tanstack/react-query";

// import {
//   useSnackbar,
// } from "notistack";

// import {
//   changePasswordApi,
// } from "../../api/profile.api";

// import {
//   changePasswordSchema,
//   type ChangePasswordFormValues,
// } from "../../schemas/change-password.schema";

// import {
//   getErrorMessage,
// } from "../../utils/error.utils";

// import PrimaryButton from "../../components/buttons/PrimaryButton";

// export default function ChangePasswordPage() {
//   const {
//     enqueueSnackbar,
//   } =
//     useSnackbar();

//   const {
//     control,
//     handleSubmit,
//     reset,
//   } =
//     useForm<ChangePasswordFormValues>({
//       resolver:
//         zodResolver(
//           changePasswordSchema
//         ),

//       defaultValues: {
//         oldPassword:
//           "",

//         newPassword:
//           "",

//         confirmPassword:
//           "",
//       },

//       mode:
//         "onTouched",
//     });

//   const mutation =
//     useMutation({
//       mutationFn:
//         changePasswordApi,

//       onSuccess:
//         (
//           message
//         ) => {
//           enqueueSnackbar(
//             message,
//             {
//               variant:
//                 "success",
//             }
//           );

//           reset();
//         },

//       onError:
//         (
//           error
//         ) => {
//           enqueueSnackbar(
//             getErrorMessage(
//               error
//             ),
//             {
//               variant:
//                 "error",
//             }
//           );
//         },
//     });

//   return (
//     <Box
//       sx={{
//         maxWidth:
//           680,

//         mx:
//           "auto",
//       }}
//     >
//       <Paper
//         elevation={0}
//         sx={{
//           border:
//             "1px solid",

//           borderColor:
//             "divider",

//           borderRadius:
//             3,

//           overflow:
//             "hidden",
//         }}
//       >
//         <Box
//           sx={{
//             p:
//               2.6,

//             display:
//               "flex",

//             alignItems:
//               "center",

//             gap:
//               1.3,

//             background:
//               "linear-gradient(135deg, #F8FAFC 0%, #EEF7F8 100%)",

//             borderBottom:
//               "1px solid",

//             borderColor:
//               "divider",
//           }}
//         >
//           <Box
//             sx={{
//               width:
//                 46,

//               height:
//                 46,

//               display:
//                 "flex",

//               alignItems:
//                 "center",

//               justifyContent:
//                 "center",

//               borderRadius:
//                 2.2,

//               color:
//                 "#078E91",

//               backgroundColor:
//                 "#E8F7F7",
//             }}
//           >
//             <LockResetRounded />
//           </Box>

//           <Box>
//             <Typography
//               sx={{
//                 fontWeight:
//                   760,

//                 fontSize:
//                   "1rem",
//               }}
//             >
//               Change Password
//             </Typography>

//             <Typography
//               sx={{
//                 mt:
//                   0.25,

//                 color:
//                   "text.secondary",

//                 fontSize:
//                   "0.72rem",
//               }}
//             >
//               Update your account password
//               securely.
//             </Typography>
//           </Box>
//         </Box>

//         <Box
//           component="form"
//           onSubmit={
//             handleSubmit(
//               (
//                 values
//               ) =>
//                 mutation.mutate(
//                   values
//                 )
//             )
//           }
//           noValidate
//           sx={{
//             p:
//               3,
//           }}
//         >
//           <Box
//             sx={{
//               display:
//                 "grid",

//               gap:
//                 2,
//             }}
//           >
//             <Controller
//               name="oldPassword"
//               control={
//                 control
//               }
//               render={({
//                 field,
//                 fieldState,
//               }) => (
//                 <TextField
//                   {...field}
//                   fullWidth
//                   type="password"
//                   label="Current Password"
//                   autoComplete="current-password"
//                   error={
//                     Boolean(
//                       fieldState.error
//                     )
//                   }
//                   helperText={
//                     fieldState.error
//                       ?.message
//                   }
//                 />
//               )}
//             />

//             <Controller
//               name="newPassword"
//               control={
//                 control
//               }
//               render={({
//                 field,
//                 fieldState,
//               }) => (
//                 <TextField
//                   {...field}
//                   fullWidth
//                   type="password"
//                   label="New Password"
//                   autoComplete="new-password"
//                   error={
//                     Boolean(
//                       fieldState.error
//                     )
//                   }
//                   helperText={
//                     fieldState.error
//                       ?.message
//                   }
//                 />
//               )}
//             />

//             <Controller
//               name="confirmPassword"
//               control={
//                 control
//               }
//               render={({
//                 field,
//                 fieldState,
//               }) => (
//                 <TextField
//                   {...field}
//                   fullWidth
//                   type="password"
//                   label="Confirm New Password"
//                   autoComplete="new-password"
//                   error={
//                     Boolean(
//                       fieldState.error
//                     )
//                   }
//                   helperText={
//                     fieldState.error
//                       ?.message
//                   }
//                 />
//               )}
//             />
//           </Box>

//           <Box
//             sx={{
//               mt:
//                 2.5,

//               display:
//                 "flex",

//               justifyContent:
//                 "flex-end",
//             }}
//           >
//             <PrimaryButton
//               type="submit"
//               loading={
//                 mutation.isPending
//               }
//               startIcon={
//                 !mutation.isPending
//                   ? <LockResetRounded />
//                   : undefined
//               }
//             >
//               Change Password
//             </PrimaryButton>
//           </Box>
//         </Box>
//       </Paper>
//     </Box>
//   );
// }


import {
  LockResetRounded,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  useState,
} from "react";

import {
  Controller,
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  useMutation,
} from "@tanstack/react-query";

import {
  useSnackbar,
} from "notistack";

import {
  changePasswordApi,
} from "../../api/profile.api";

import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../../schemas/change-password.schema";

import {
  getErrorMessage,
} from "../../utils/error.utils";

import {
  allowPasswordInput,
} from "../../utils/validation.utils";

import PrimaryButton from "../../components/buttons/PrimaryButton";

export default function ChangePasswordPage() {
  const {
    enqueueSnackbar,
  } = useSnackbar();

  const [showOldPassword, setShowOldPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const {
    control,
    handleSubmit,
    reset,
  } =
    useForm<ChangePasswordFormValues>({
      resolver:
        zodResolver(
          changePasswordSchema
        ),

      defaultValues: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },

      mode:
        "onChange",

      reValidateMode:
        "onChange",
    });

  const mutation =
    useMutation({
      mutationFn:
        changePasswordApi,

      onSuccess:
        (
          message
        ) => {
          enqueueSnackbar(
            message,
            {
              variant:
                "success",
            }
          );

          reset();

          setShowOldPassword(false);
          setShowNewPassword(false);
          setShowConfirmPassword(false);
        },

      onError:
        (
          error
        ) => {
          enqueueSnackbar(
            getErrorMessage(
              error
            ),
            {
              variant:
                "error",
            }
          );
        },
    });

  const passwordFieldSx = {
    "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
      {
        borderColor:
          "divider",
      },

    "& .MuiOutlinedInput-root.Mui-error:hover .MuiOutlinedInput-notchedOutline":
      {
        borderColor:
          "divider",
      },

    "& .MuiInputLabel-root.Mui-error":
      {
        color:
          "text.primary",
      },

    "& .MuiFormHelperText-root.Mui-error":
      {
        color:
          "error.main",

        fontWeight:
          500,
      },
  };

  return (
    <Box
      sx={{
        maxWidth:
          680,
        mx:
          "auto",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          border:
            "1px solid",
          borderColor:
            "divider",
          borderRadius:
            3,
          overflow:
            "hidden",
        }}
      >
        <Box
          sx={{
            p:
              2.6,
            display:
              "flex",
            alignItems:
              "center",
            gap:
              1.3,
            background:
              "linear-gradient(135deg, #F8FAFC 0%, #EEF7F8 100%)",
            borderBottom:
              "1px solid",
            borderColor:
              "divider",
          }}
        >
          <Box
            sx={{
              width:
                46,
              height:
                46,
              display:
                "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              borderRadius:
                2.2,
              color:
                "#078E91",
              backgroundColor:
                "#E8F7F7",
            }}
          >
            <LockResetRounded />
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight:
                  760,
                fontSize:
                  "1rem",
              }}
            >
              Change Password
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
              Update your account password
              securely.
            </Typography>
          </Box>
        </Box>

        <Box
          component="form"
          onSubmit={
            handleSubmit(
              (
                values
              ) =>
                mutation.mutate(
                  values
                )
            )
          }
          noValidate
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
                2,
            }}
          >
            {/* Current Password */}
            <Controller
              name="oldPassword"
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
                  type={
                    showOldPassword
                      ? "text"
                      : "password"
                  }
                  label="Current Password *"
                  autoComplete="current-password"
                  error={
                    Boolean(
                      fieldState.error
                    )
                  }
                  helperText={
                    fieldState.error
                      ?.message
                  }
                  onChange={(
                    event
                  ) => {
                    const value =
                      event.target.value;

                    if (
                      allowPasswordInput(
                        value
                      )
                    ) {
                      field.onChange(
                        value
                      );
                    }
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment
                          position="end"
                        >
                          <IconButton
                            edge="end"
                            onClick={() =>
                              setShowOldPassword(
                                (
                                  previous
                                ) =>
                                  !previous
                              )
                            }
                            onMouseDown={(
                              event
                            ) =>
                              event.preventDefault()
                            }
                            aria-label={
                              showOldPassword
                                ? "Hide current password"
                                : "Show current password"
                            }
                          >
                            {showOldPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={
                    passwordFieldSx
                  }
                />
              )}
            />

            {/* New Password */}
            <Controller
              name="newPassword"
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
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  label="New Password *"
                  autoComplete="new-password"
                  error={
                    Boolean(
                      fieldState.error
                    )
                  }
                  helperText={
                    fieldState.error
                      ?.message
                  }
                  onChange={(
                    event
                  ) => {
                    const value =
                      event.target.value;

                    if (
                      allowPasswordInput(
                        value
                      )
                    ) {
                      field.onChange(
                        value
                      );
                    }
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment
                          position="end"
                        >
                          <IconButton
                            edge="end"
                            onClick={() =>
                              setShowNewPassword(
                                (
                                  previous
                                ) =>
                                  !previous
                              )
                            }
                            onMouseDown={(
                              event
                            ) =>
                              event.preventDefault()
                            }
                            aria-label={
                              showNewPassword
                                ? "Hide new password"
                                : "Show new password"
                            }
                          >
                            {showNewPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={
                    passwordFieldSx
                  }
                />
              )}
            />

            {/* Confirm New Password */}
            <Controller
              name="confirmPassword"
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
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  label="Confirm New Password *"
                  autoComplete="new-password"
                  error={
                    Boolean(
                      fieldState.error
                    )
                  }
                  helperText={
                    fieldState.error
                      ?.message
                  }
                  onChange={(
                    event
                  ) => {
                    const value =
                      event.target.value;

                    if (
                      allowPasswordInput(
                        value
                      )
                    ) {
                      field.onChange(
                        value
                      );
                    }
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment
                          position="end"
                        >
                          <IconButton
                            edge="end"
                            onClick={() =>
                              setShowConfirmPassword(
                                (
                                  previous
                                ) =>
                                  !previous
                              )
                            }
                            onMouseDown={(
                              event
                            ) =>
                              event.preventDefault()
                            }
                            aria-label={
                              showConfirmPassword
                                ? "Hide confirm password"
                                : "Show confirm password"
                            }
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={
                    passwordFieldSx
                  }
                />
              )}
            />
          </Box>

          <Box
            sx={{
              mt:
                2.5,
              display:
                "flex",
              justifyContent:
                "flex-end",
            }}
          >
            <PrimaryButton
              type="submit"
              loading={
                mutation.isPending
              }
              startIcon={
                !mutation.isPending
                  ? (
                    <LockResetRounded />
                  )
                  : undefined
              }
            >
              Change Password
            </PrimaryButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}




