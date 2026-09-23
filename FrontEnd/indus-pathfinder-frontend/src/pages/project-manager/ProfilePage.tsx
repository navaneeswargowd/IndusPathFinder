import {
  AccountCircleOutlined,
  BusinessOutlined,
  SaveRounded,
} from "@mui/icons-material";

import {
  Box,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

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
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  useSnackbar,
} from "notistack";

import {
  getProfileApi,
  updateProfileApi,
} from "../../api/profile.api";

import {
  profileSchema,
  type ProfileFormValues,
} from "../../schemas/profile.schema";

import {
  getErrorMessage,
} from "../../utils/error.utils";

import {
  allowPersonNameInput,
  allowMobileInput,
} from "../../utils/validation.utils";

import PrimaryButton
  from "../../components/buttons/PrimaryButton";

import {
  useAuth,
} from "../../auth/useAuth";


export default function ProfilePage() {

  const {
    enqueueSnackbar,
  } = useSnackbar();

  const queryClient =
    useQueryClient();

  const {
    updateAuthenticatedUser,
  } = useAuth();


  /*
   * ==========================================================
   * GET PROFILE
   * ==========================================================
   */

  const query =
    useQuery({
      queryKey: [
        "profile",
      ],

      queryFn:
        getProfileApi,

      staleTime:
        30_000,
    });


  /*
   * ==========================================================
   * FORM
   *
   * Only:
   *
   * firstName
   * lastName
   * mobile
   *
   * are editable.
   * ==========================================================
   */

  // const {
  //   control,
  //   handleSubmit,
  //   reset,
  // } =
  //   useForm<ProfileFormValues>({
  //     resolver:
  //       zodResolver(
  //         profileSchema
  //       ),

  //     defaultValues: {
  //       firstName:
  //         "",

  //       lastName:
  //         "",

  //       mobile:
  //         "",
  //     },

  //     mode:
  //       "onTouched",
  //   });


  const {
  control,
  handleSubmit,
  reset,
} =
  useForm<ProfileFormValues>({
    resolver:
      zodResolver(
        profileSchema
      ),

    defaultValues: {
      firstName: "",
      lastName: "",
      mobile: "",
    },

    mode:
      "onTouched",
  });


  /*
   * ==========================================================
   * LOAD PROFILE DATA
   * ==========================================================
   */

useEffect(
  () => {

    if (!query.data) {
      return;
    }

    reset({
      firstName:
        query.data.firstName ?? "",

      lastName:
        query.data.lastName ?? "",

      mobile:
        String(
          query.data.mobile ?? ""
        ),
    });

  },
  [
    query.data,
    reset,
  ]
);


  /*
   * ==========================================================
   * UPDATE PROFILE
   * ==========================================================
   */

  const mutation =
    useMutation({
      mutationFn:
        updateProfileApi,

      onSuccess:
        (
          response
        ) => {

          /*
           * First Name and Last Name may
           * appear in header/sidebar,
           * so update Auth Context.
           */
          updateAuthenticatedUser({
            firstName:
              response.firstName,

            lastName:
              response.lastName,

            userName:
              response.userName,

            email:
              response.email,
          });


          /*
           * Update profile cache.
           */
          queryClient.setQueryData(
            [
              "profile",
            ],
            response
          );


          /*
           * Reset editable fields using
           * latest backend response.
           */
          reset({
            firstName:
              response.firstName ??
              "",

            lastName:
              response.lastName ??
              "",

            mobile:
              String(
                response.mobile ??
                ""
              ),
          });


          enqueueSnackbar(
            "Profile updated successfully.",
            {
              variant:
                "success",
            }
          );
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


  /*
   * ==========================================================
   * LOADING
   * ==========================================================
   */

  if (
    query.isLoading
  ) {

    return (
      <Box
        sx={{
          minHeight:
            320,

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }


  /*
   * ==========================================================
   * ERROR
   * ==========================================================
   */

  if (
    query.isError
  ) {

    return (
      <Paper
        elevation={0}
        sx={{
          maxWidth:
            950,

          mx:
            "auto",

          p:
            4,

          textAlign:
            "center",

          border:
            "1px solid",

          borderColor:
            "divider",

          borderRadius:
            3,
        }}
      >
        <Typography
          sx={{
            color:
              "error.main",

            fontWeight:
              700,
          }}
        >
          Unable to load profile.
        </Typography>

        <Typography
          sx={{
            mt:
              0.5,

            color:
              "text.secondary",

            fontSize:
              "0.75rem",
          }}
        >
          Please refresh the page and try again.
        </Typography>
      </Paper>
    );
  }


  const profile =
    query.data;


  if (
    !profile
  ) {
    return null;
  }


  /*
   * ==========================================================
   * PROFILE INITIALS
   * ==========================================================
   */

  const firstInitial =
    profile.firstName
      ?.trim()
      .charAt(0)
      .toUpperCase() ??
    "";


  const lastInitial =
    profile.lastName
      ?.trim()
      .charAt(0)
      .toUpperCase() ??
    "";


  const initials =
    `${firstInitial}${lastInitial}` ||
    profile.userName
      ?.charAt(0)
      .toUpperCase() ||
    "U";


  /*
   * ==========================================================
   * SUBMIT
   * ==========================================================
   */

const submitForm = (
  values: ProfileFormValues
) => {

  mutation.mutate({
    firstName:
      values.firstName,

    lastName:
      values.lastName,

    mobile:
      values.mobile,
  });
};


  return (
    <Box
      sx={{
        maxWidth:
          950,

        mx:
          "auto",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          overflow:
            "hidden",

          border:
            "1px solid",

          borderColor:
            "divider",

          borderRadius:
            3,

          backgroundColor:
            "#FFFFFF",

          boxShadow:
            "0 10px 35px rgba(15, 35, 65, 0.035)",
        }}
      >

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <Box
          sx={{
            px: {
              xs:
                2,

              md:
                3,
            },

            py:
              2.5,

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
                48,

              height:
                48,

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              flexShrink:
                0,

              borderRadius:
                2.3,

              color:
                "#078E91",

              backgroundColor:
                "#E8F7F7",
            }}
          >
            <AccountCircleOutlined />
          </Box>


          <Box>
            <Typography
              sx={{
                fontSize:
                  "1rem",

                fontWeight:
                  760,
              }}
            >
              My Profile
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
              Manage your personal information.
            </Typography>
          </Box>
        </Box>


        {/* ================================================= */}
        {/* MAIN CONTENT */}
        {/* ================================================= */}

        <Box
          sx={{
            p: {
              xs:
                2,

              md:
                3,
            },

            display:
              "grid",

            gridTemplateColumns: {
              xs:
                "1fr",

              md:
                "260px minmax(0, 1fr)",
            },

            gap:
              3,
          }}
        >

          {/* =============================================== */}
          {/* LEFT PROFILE CARD */}
          {/* =============================================== */}

          <Paper
            elevation={0}
            sx={{
              p:
                2.2,

              alignSelf:
                "start",

              textAlign:
                "center",

              border:
                "1px solid",

              borderColor:
                "divider",

              borderRadius:
                2.5,

              backgroundColor:
                "#FBFCFD",
            }}
          >

            {/* PROFILE INITIALS */}

            <Box
              sx={{
                width:
                  72,

                height:
                  72,

                mx:
                  "auto",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                borderRadius:
                  "50%",

                color:
                  "#FFFFFF",

                fontSize:
                  "1.35rem",

                fontWeight:
                  800,

                background:
                  "linear-gradient(135deg, #173B73 0%, #078E91 100%)",

                boxShadow:
                  "0 10px 24px rgba(7, 142, 145, 0.17)",
              }}
            >
              {initials}
            </Box>


            {/* NAME */}

            <Typography
              sx={{
                mt:
                  1.5,

                fontWeight:
                  750,

                fontSize:
                  "0.9rem",
              }}
            >
              {profile.firstName}{" "}
              {profile.lastName}
            </Typography>


            {/* USERNAME */}

            <Typography
              sx={{
                mt:
                  0.25,

                color:
                  "text.secondary",

                fontSize:
                  "0.68rem",
              }}
            >
              @{profile.userName}
            </Typography>


            {/* ROLE */}

            <Typography
              sx={{
                mt:
                  0.45,

                color:
                  "#078E91",

                fontSize:
                  "0.67rem",

                fontWeight:
                  750,
              }}
            >
              {formatRole(
                profile.role
              )}
            </Typography>


            {/* ORGANIZATION */}

            <Box
              sx={{
                mt:
                  2,

                pt:
                  2,

                borderTop:
                  "1px solid",

                borderColor:
                  "divider",
              }}
            >
              <BusinessOutlined
                sx={{
                  color:
                    "text.secondary",

                  fontSize:
                    19,
                }}
              />

              <Typography
                sx={{
                  mt:
                    0.6,

                  fontSize:
                    "0.66rem",

                  color:
                    "text.secondary",
                }}
              >
                Organization
              </Typography>

              <Typography
                sx={{
                  mt:
                    0.25,

                  fontSize:
                    "0.75rem",

                  fontWeight:
                    700,
                }}
              >
                {profile.orgName ||
                  "-"}
              </Typography>
            </Box>


            {/* ORGANIZATION DETAILS */}

            <Box
              sx={{
                mt:
                  2.2,

                pt:
                  2,

                display:
                  "grid",

                gap:
                  1.5,

                borderTop:
                  "1px solid",

                borderColor:
                  "divider",
              }}
            >

              <Box>
                <Typography
                  sx={{
                    color:
                      "text.secondary",

                    fontSize:
                      "0.68rem",
                  }}
                >
                  Organization Email
                </Typography>

                <Typography
                  sx={{
                    mt:
                      0.25,

                    fontSize:
                      "0.75rem",

                    fontWeight:
                      700,

                    wordBreak:
                      "break-word",
                  }}
                >
                  {profile.orgEmail ||
                    "-"}
                </Typography>
              </Box>


              <Box>
                <Typography
                  sx={{
                    color:
                      "text.secondary",

                    fontSize:
                      "0.68rem",
                  }}
                >
                  Organization Phone
                </Typography>

                <Typography
                  sx={{
                    mt:
                      0.25,

                    fontSize:
                      "0.75rem",

                    fontWeight:
                      700,
                  }}
                >
                  {profile.orgPhone ||
                    "-"}
                </Typography>
              </Box>


              <Box>
                <Typography
                  sx={{
                    color:
                      "text.secondary",

                    fontSize:
                      "0.68rem",
                  }}
                >
                  Location
                </Typography>

                <Typography
                  sx={{
                    mt:
                      0.25,

                    fontSize:
                      "0.75rem",

                    fontWeight:
                      700,
                  }}
                >
                  {[
                    profile.city,
                    profile.state,
                  ]
                    .filter(
                      Boolean
                    )
                    .join(
                      ", "
                    ) ||
                    "-"}
                </Typography>
              </Box>


              <Box>
                <Typography
                  sx={{
                    color:
                      "text.secondary",

                    fontSize:
                      "0.68rem",
                  }}
                >
                  Website
                </Typography>

                <Typography
                  sx={{
                    mt:
                      0.25,

                    fontSize:
                      "0.75rem",

                    fontWeight:
                      700,

                    wordBreak:
                      "break-word",
                  }}
                >
                  {profile.website ||
                    "-"}
                </Typography>
              </Box>

            </Box>
          </Paper>


          {/* =============================================== */}
          {/* PROFILE FORM */}
          {/* =============================================== */}

          <Box
  component="form"
  noValidate
  onSubmit={
    handleSubmit(
      submitForm
    )
  }
>

            <Typography
              sx={{
                mb:
                  1.8,

                fontSize:
                  "0.84rem",

                fontWeight:
                  750,
              }}
            >
              Personal Information
            </Typography>


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

              {/* =========================================== */}
              {/* FIRST NAME - EDITABLE */}
              {/* =========================================== */}

              <Controller
                name="firstName"

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

                    label="First Name *"

                    placeholder="Enter first name"

                    onChange={(
                      event
                    ) => {

                      const value =
                        event.target.value;


                      if (
                        !allowPersonNameInput(
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
                     * No red border.
                     * No red label.
                     * No red placeholder.
                     *
                     * Only error message
                     * is shown in red.
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
                          50,
                      },

                      formHelperText: {
                        sx: {
                          color:
                            fieldState.error
                              ? "error.main"
                              : "transparent",

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


              {/* =========================================== */}
              {/* LAST NAME - EDITABLE */}
              {/* =========================================== */}

              <Controller
                name="lastName"

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

                    label="Last Name *"

                    placeholder="Enter last name"

                    onChange={(
                      event
                    ) => {

                      const value =
                        event.target.value;


                      if (
                        !allowPersonNameInput(
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
                          50,
                      },

                      formHelperText: {
                        sx: {
                          color:
                            fieldState.error
                              ? "error.main"
                              : "transparent",

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


              {/* =========================================== */}
              {/* MOBILE NUMBER - EDITABLE */}
              {/* =========================================== */}

<Controller
  name="mobile"
  control={control}
  render={({
    field,
    fieldState,
  }) => (
    <TextField
      {...field}

      fullWidth

      label="Mobile Number *"

      placeholder="Enter 10-digit mobile number"

      inputMode="numeric"

      onChange={(event) => {

        const value =
          event.target.value;

        if (
          !allowMobileInput(
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
          maxLength: 10,
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


              {/* =========================================== */}
              {/* USERNAME - NOT EDITABLE */}
              {/* =========================================== */}

             <TextField
  fullWidth
  disabled
  label="Username"
  value={
    profile.userName ?? ""
  }
/>


              {/* =========================================== */}
              {/* EMAIL - NOT EDITABLE */}
              {/* =========================================== */}
<TextField
  fullWidth
  disabled
  label="Email"
  value={
    profile.email ?? ""
  }
/>


              {/* =========================================== */}
              {/* STATUS - NOT EDITABLE */}
              {/* =========================================== */}

<TextField
  fullWidth
  disabled
  label="Status"
  value={
    profile.status ?? ""
  }
/>

            </Box>


            {/* ============================================= */}
            {/* SAVE */}
            {/* ============================================= */}

            <Box
              sx={{
                mt:
                  2.5,

                pt:
                  2,

                display:
                  "flex",

                justifyContent:
                  "flex-end",

                borderTop:
                  "1px solid",

                borderColor:
                  "divider",
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
                        <SaveRounded />
                      )
                    : undefined
                }
              >
                Save Changes
              </PrimaryButton>
            </Box>

          </Box>
        </Box>
      </Paper>
    </Box>
  );
}


/*
 * ==========================================================
 * ROLE FORMAT
 * ==========================================================
 */

function formatRole(
  role:
    string |
    null |
    undefined
): string {

  if (
    !role
  ) {
    return "-";
  }

  return role
    .replaceAll(
      "_",
      " "
    )
    .toLowerCase()
    .replace(
      /\b\w/g,
      (
        character
      ) =>
        character.toUpperCase()
    );
}