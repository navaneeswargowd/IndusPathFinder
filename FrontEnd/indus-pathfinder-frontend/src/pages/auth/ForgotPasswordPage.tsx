// src/pages/auth/ForgotPasswordPage.tsx

import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import {
  MarkEmailReadOutlined,
} from "@mui/icons-material";

import {
  Link,
  useNavigate,
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
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../../schemas/forgot-password.schema";

import {
  forgotPasswordApi,
} from "../../api/auth.api";

import {
  ROUTES,
} from "../../config/routes.config";

import {
  getErrorMessage,
} from "../../utils/error.utils";

import {
  allowEmailInput,
} from "../../utils/validation.utils";

import FormTextField from "../../components/forms/FormTextField";
import PrimaryButton from "../../components/buttons/PrimaryButton";

export default function ForgotPasswordPage() {
  const navigate =
    useNavigate();

  const {
    enqueueSnackbar,
  } = useSnackbar();

  const {
    control,
    handleSubmit,
  } =
    useForm<ForgotPasswordFormValues>({
      resolver:
        zodResolver(
          forgotPasswordSchema
        ),

      defaultValues: {
        email: "",
      },

      mode: "onTouched",
    });

  const forgotPasswordMutation =
    useMutation({
      mutationFn:
        forgotPasswordApi,

      onSuccess: (
        message,
        variables
      ) => {
        /*
         * BACKEND RESPONSE:
         * "OTP has been sent successfully."
         */

        enqueueSnackbar(
          message,
          {
            variant:
              "success",
          }
        );

        /*
         * Navigate to OTP verification.
         *
         * Pass email through query parameter so the user
         * does not need to enter it again.
         */
        navigate(
          `${ROUTES.VERIFY_OTP}?email=${encodeURIComponent(
            variables.email
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

  const onSubmit = (
    values:
      ForgotPasswordFormValues
  ) => {
    forgotPasswordMutation.mutate(
      values
    );
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize:
              "0.72rem",

            fontWeight: 750,

            color:
              "secondary.main",

            letterSpacing:
              "0.12em",

            textTransform:
              "uppercase",
          }}
        >
          Account Recovery
        </Typography>

        <Typography
          variant="h4"
          sx={{
            mt: 0.8,
          }}
        >
          Forgot password?
        </Typography>

        <Typography
          sx={{
            mt: 1,

            color:
              "text.secondary",

            fontSize:
              "0.85rem",

            lineHeight: 1.7,
          }}
        >
          Enter your registered email
          address. We will send an OTP
          to verify your identity.
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={
          handleSubmit(
            onSubmit
          )
        }
        noValidate
      >
        <Stack spacing={2.3}>
          <FormTextField
  name="email"
  control={control}
  label="Email *"
  allowValue={
    allowEmailInput
  }
  textFieldProps={{
    type: "text",

    autoComplete:
      "email",

    placeholder:
      "Enter your registered email",

    slotProps: {
      htmlInput: {
        maxLength: 100,
      },
    },
  }}
/>

          <PrimaryButton
            type="submit"
            fullWidth
            size="large"
            loading={
              forgotPasswordMutation
                .isPending
            }
            startIcon={
              !forgotPasswordMutation
                .isPending
                ? (
                    <MarkEmailReadOutlined />
                  )
                : undefined
            }
          >
            Send OTP
          </PrimaryButton>
        </Stack>
      </Box>

      <Button
        component={Link}
        to={ROUTES.LOGIN}
        sx={{
          mt: 2.5,

          px: 0,

          minHeight: 0,
        }}
      >
        Back to Sign In
      </Button>
    </Box>
  );
}