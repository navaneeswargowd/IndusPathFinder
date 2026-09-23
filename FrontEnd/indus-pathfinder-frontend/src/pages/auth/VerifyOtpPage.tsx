import {
  Box,
  Button,
  Divider,
  Paper,
  Typography,
} from "@mui/material";

import {
  ArrowBackRounded,
  EmailOutlined,
  LockClockOutlined,
  VerifiedOutlined,
} from "@mui/icons-material";


import {
  useLocation,
} from "react-router-dom";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
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
  verifyOtpSchema,
  type VerifyOtpFormValues,
} from "../../schemas/verify-otp.schema";

import {
  verifyOtpApi,
} from "../../api/auth.api";

import {
  getErrorMessage,
} from "../../utils/error.utils";

import {
  ROUTES,
} from "../../config/routes.config";

import FormTextField
  from "../../components/forms/FormTextField";

import PrimaryButton
  from "../../components/buttons/PrimaryButton";

  import {
  allowOtpInput,
} from "../../utils/validation.utils";


export default function VerifyOtpPage() {
  const navigate =
    useNavigate();

  const {
    enqueueSnackbar,
  } =
    useSnackbar();

  const [
    searchParams,
  ] =
    useSearchParams();

  const email =
    searchParams.get(
      "email"
    ) ?? "";

  const {
    control,
    handleSubmit,
  } =
    useForm<VerifyOtpFormValues>({
      resolver:
        zodResolver(
          verifyOtpSchema
        ),

      defaultValues: {
        email,
        otp: "",
      },

      mode:
        "onTouched",
    });

  const mutation =
    useMutation({
      mutationFn:
        verifyOtpApi,

      onSuccess: (
        message,
        variables
      ) => {
        enqueueSnackbar(
          message,
          {
            variant:
              "success",
          }
        );

        navigate(
          `${ROUTES.RESET_PASSWORD}?email=${encodeURIComponent(
            variables.email
          )}&otp=${encodeURIComponent(
            variables.otp
          )}`
        );
      },

      onError: (
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

  return (
    <Box
      sx={{
        minHeight:
          "100vh",

        width:
          "100%",

        position:
          "relative",

        overflow:
          "hidden",

        display:
          "flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        px: {
          xs: 1.5,
          sm: 2.5,
          md: 3,
        },

        py: {
          xs: 1.5,
          sm: 2,
        },

        background:
          "linear-gradient(135deg, #EAF2FA 0%, #F8FBFD 50%, #E7F6F6 100%)",
      }}
    >
      {/* BACKGROUND DECORATION */}

      <Box
        sx={{
          position:
            "absolute",

          width:
            420,

          height:
            420,

          borderRadius:
            "50%",

          top:
            -230,

          right:
            -120,

          background:
            "linear-gradient(135deg, rgba(7,142,145,0.12), rgba(23,59,115,0.04))",
        }}
      />

      <Box
        sx={{
          position:
            "absolute",

          width:
            320,

          height:
            320,

          borderRadius:
            "50%",

          left:
            -150,

          bottom:
            -180,

          background:
            "rgba(23,59,115,0.055)",
        }}
      />

      {/* MAIN CARD */}

      <Paper
        elevation={0}
        sx={{
          position:
            "relative",

          zIndex:
            1,

          width:
            "100%",

          maxWidth:
            760,

          px: {
            xs: 2.5,
            sm: 4,
            md: 5,
          },

          py: {
            xs: 2.2,
            sm: 2.5,
            md: 2.7,
          },

          borderRadius:
            4,

          border:
            "1px solid rgba(15,45,80,0.08)",

          backgroundColor:
            "rgba(255,255,255,0.98)",

          boxShadow:
            "0 24px 65px rgba(22,56,92,0.13)",
        }}
      >
        {/* TOP SECTION */}

        <Box
          sx={{
            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            gap:
              1.4,
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
                2.4,

              color:
                "#FFFFFF",

              background:
                "linear-gradient(135deg, #173B73 0%, #078E91 100%)",

              boxShadow:
                "0 10px 22px rgba(7,142,145,0.18)",
            }}
          >
            <VerifiedOutlined
              sx={{
                fontSize:
                  24,
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize:
                  "0.62rem",

                fontWeight:
                  800,

                color:
                  "#078E91",

                letterSpacing:
                  "0.14em",

                textTransform:
                  "uppercase",
              }}
            >
              Secure Verification
            </Typography>

            <Typography
              sx={{
                mt:
                  0.2,

                color:
                  "#10233E",

                fontSize: {
                  xs:
                    "1.3rem",

                  sm:
                    "1.55rem",
                },

                fontWeight:
                  780,

                letterSpacing:
                  "-0.035em",
              }}
            >
              Enter verification code
            </Typography>
          </Box>
        </Box>

        <Typography
          sx={{
            mt:
              0.9,

            textAlign:
              "center",

            color:
              "text.secondary",

            fontSize:
              "0.75rem",

            lineHeight:
              1.5,
          }}
        >
          Enter the 6-digit OTP sent to your
          registered email address.
        </Typography>

        {/* FORM */}

        <Box
          component="form"
          noValidate
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
          sx={{
            mt:
              1.5,

            maxWidth:
              560,

            mx:
              "auto",
          }}
        >
          {/* HIDDEN EMAIL */}

          <Box
            sx={{
              display:
                "none",
            }}
          >
            <FormTextField
              name="email"
              control={
                control
              }
              label="Email"
            />
          </Box>

          {/* REGISTERED EMAIL */}

          <Typography
            sx={{
              mb:
                0.55,

              color:
                "#344054",

              fontSize:
                "0.68rem",

              fontWeight:
                700,
            }}
          >
            Registered Email
          </Typography>

          <Box
            sx={{
              height:
                48,

              px:
                1.4,

              display:
                "flex",

              alignItems:
                "center",

              gap:
                1,

              border:
                "1px solid #DCE7F0",

              borderRadius:
                2.3,

              backgroundColor:
                "#F8FBFD",
            }}
          >
            <Box
              sx={{
                width:
                  32,

                height:
                  32,

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                flexShrink:
                  0,

                borderRadius:
                  1.6,

                color:
                  "#173B73",

                backgroundColor:
                  "#EAF1FA",
              }}
            >
              <EmailOutlined
                sx={{
                  fontSize:
                    17,
                }}
              />
            </Box>

            <Typography
              sx={{
                minWidth:
                  0,

                overflow:
                  "hidden",

                textOverflow:
                  "ellipsis",

                whiteSpace:
                  "nowrap",

                fontSize:
                  "0.75rem",

                fontWeight:
                  700,
              }}
            >
              {email ||
                "Registered email"}
            </Typography>
          </Box>

          {/* OTP */}

          <Typography
            sx={{
              mt:
                1.3,

              mb:
                0.55,

              color:
                "#344054",

              fontSize:
                "0.68rem",

              fontWeight:
                700,
            }}
          >
            Verification Code
          </Typography>

<FormTextField
  name="otp"
  control={control}
  label="OTP *"
  allowValue={
    allowOtpInput
  }
  textFieldProps={{
    type: "text",

    inputMode:
      "numeric",

    autoComplete:
      "one-time-code",

    placeholder:
      "Enter 6-digit OTP",

    slotProps: {
      htmlInput: {
        maxLength: 6,
      },
    },
  }}
/>

          {/* VERIFY BUTTON */}

          <PrimaryButton
            type="submit"
            fullWidth
            loading={
              mutation.isPending
            }
            startIcon={
              !mutation.isPending
                ? (
                    <VerifiedOutlined />
                  )
                : undefined
            }
            sx={{
              mt:
                1.4,

              minHeight:
                42,

              borderRadius:
                2.3,
            }}
          >
            Verify & Continue
          </PrimaryButton>
        </Box>

        {/* RESEND */}

        <Box
          sx={{
            mt:
              1.1,

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            flexWrap:
              "wrap",
          }}
        >
          <Typography
            sx={{
              color:
                "text.secondary",

              fontSize:
                "0.69rem",
            }}
          >
            Didn't receive the code?
          </Typography>

          <Button
            component={
              Link
            }
            to={
              ROUTES.FORGOT_PASSWORD
            }
            size="small"
            sx={{
              px:
                0.5,

              minWidth:
                0,

              minHeight:
                0,

              fontSize:
                "0.69rem",

              fontWeight:
                750,
            }}
          >
            Request new OTP
          </Button>
        </Box>

        <Divider
          sx={{
            my:
              1.2,
          }}
        />

        {/* BOTTOM INFO */}

        <Box
          sx={{
            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            flexDirection: {
              xs:
                "column",

              sm:
                "row",
            },

            gap:
              0.8,
          }}
        >
          <Box
            sx={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                0.6,

              color:
                "text.secondary",
            }}
          >
            <LockClockOutlined
              sx={{
                fontSize:
                  14,
              }}
            />

            <Typography
              sx={{
                fontSize:
                  "0.61rem",
              }}
            >
              Never share your verification code.
            </Typography>
          </Box>

          <Button
            component={
              Link
            }
            to={
              ROUTES.LOGIN
            }
            size="small"
            startIcon={
              <ArrowBackRounded />
            }
            sx={{
              minHeight:
                0,

              color:
                "text.secondary",

              fontSize:
                "0.66rem",
            }}
          >
            Back to Sign In
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}