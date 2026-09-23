import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import {
  LockResetOutlined,
} from "@mui/icons-material";

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
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../../schemas/reset-password.schema";

import {
  resetPasswordApi,
} from "../../api/auth.api";

import {
  ROUTES,
} from "../../config/routes.config";

import {
  getErrorMessage,
} from "../../utils/error.utils";

import {
  useState,
} from "react";

import {
  IconButton,
  InputAdornment,
} from "@mui/material";

import {
  VisibilityOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";

import {
  allowPasswordInput,
} from "../../utils/validation.utils";

import FormTextField from "../../components/forms/FormTextField";
import FormPasswordField from "../../components/forms/FormPasswordField";
import PrimaryButton from "../../components/buttons/PrimaryButton";

export default function ResetPasswordPage() {
  const navigate =
    useNavigate();

  const {
    enqueueSnackbar,
  } = useSnackbar();

  const [
    searchParams,
  ] = useSearchParams();

const [
  showNewPassword,
  setShowNewPassword,
] = useState(false);

const [
  showConfirmPassword,
  setShowConfirmPassword,
] = useState(false);

  const email =
  searchParams.get("email") ?? "";

const otp =
  searchParams.get("otp") ?? "";

  const {
    control,
    handleSubmit,
  } =
    useForm<ResetPasswordFormValues>({
      resolver:
        zodResolver(
          resetPasswordSchema
        ),

      defaultValues: {
  email,
  otp,
  newPassword: "",
  confirmPassword: "",
},
      mode: "onTouched",
    });

  const mutation =
    useMutation({
      mutationFn:
        resetPasswordApi,

      onSuccess: () => {
        enqueueSnackbar(
          "Password reset successfully. Please sign in with your new password.",
          {
            variant:
              "success",
          }
        );

        navigate(
          ROUTES.LOGIN,
          {
            replace: true,
          }
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
    <Box>
      <Typography
        sx={{
          fontSize:
            "0.73rem",
          fontWeight: 750,
          color:
            "secondary.main",
          letterSpacing:
            "0.12em",
          textTransform:
            "uppercase",
        }}
      >
        Secure reset
      </Typography>

      <Typography
        variant="h4"
        sx={{ mt: 0.8 }}
      >
        Create new password
      </Typography>

      <Typography
        sx={{
          mt: 1,
          mb: 3,
          color:
            "text.secondary",
          fontSize:
            "0.85rem",
        }}
      >
        Use at least 8 characters
        with uppercase, lowercase,
        number and special character.
      </Typography>

      <Box
        component="form"
        onSubmit={
          handleSubmit(
            (values) =>
              mutation.mutate(
                values
              )
          )
        }
        noValidate
      >
        <Stack spacing={2.2}>
          <FormTextField
            name="email"
            control={control}
            label="Registered Email"
            textFieldProps={{
              type: "email",
            }}
          />
          <FormTextField
  name="otp"
  control={control}
  label="OTP"
  textFieldProps={{
    inputMode: "numeric",
  }}
/>

          <FormTextField
  name="newPassword"
  control={control}
  label="New Password *"
  allowValue={
    allowPasswordInput
  }
  textFieldProps={{
    type:
      showNewPassword
        ? "text"
        : "password",

    autoComplete:
      "new-password",

    placeholder:
      "Enter new password",

    slotProps: {
      htmlInput: {
        maxLength: 50,
      },

      input: {
        endAdornment: (
          <InputAdornment
            position="end"
          >
            <IconButton
              edge="end"
              size="small"
              onClick={() =>
                setShowNewPassword(
                  (previous) =>
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
                <VisibilityOffOutlined
                  fontSize="small"
                />
              ) : (
                <VisibilityOutlined
                  fontSize="small"
                />
              )}
            </IconButton>
          </InputAdornment>
        ),
      },
    },
  }}
/>

          <FormTextField
  name="confirmPassword"
  control={control}
  label="Confirm Password *"
  allowValue={
    allowPasswordInput
  }
  textFieldProps={{
    type:
      showConfirmPassword
        ? "text"
        : "password",

    autoComplete:
      "new-password",

    placeholder:
      "Re-enter new password",

    slotProps: {
      htmlInput: {
        maxLength: 50,
      },

      input: {
        endAdornment: (
          <InputAdornment
            position="end"
          >
            <IconButton
              edge="end"
              size="small"
              onClick={() =>
                setShowConfirmPassword(
                  (previous) =>
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
                <VisibilityOffOutlined
                  fontSize="small"
                />
              ) : (
                <VisibilityOutlined
                  fontSize="small"
                />
              )}
            </IconButton>
          </InputAdornment>
        ),
      },
    },
  }}
/>

          <PrimaryButton
            type="submit"
            fullWidth
            loading={
              mutation.isPending
            }
            startIcon={
              !mutation.isPending
                ? (
                    <LockResetOutlined />
                  )
                : undefined
            }
          >
            Reset Password
          </PrimaryButton>
        </Stack>
      </Box>

      <Button
        component={Link}
        to={ROUTES.LOGIN}
        sx={{
          mt: 2,
          px: 0,
        }}
      >
        Back to Sign In
      </Button>
    </Box>
  );
}