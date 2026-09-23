import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  LoginRounded,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

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
  loginSchema,
  type LoginFormValues,
} from "../../schemas/login.schema";

import {
  loginApi,
} from "../../api/auth.api";

import {
  useAuth,
} from "../../auth/useAuth";

import {
  UserRole,
} from "../../enums/role.enum";

import {
  ROUTES,
} from "../../config/routes.config";

import {
  getErrorMessage,
} from "../../utils/error.utils";

import {
  // allowLoginEmailInput,
  allowEmailInput,
  allowPasswordInput,
} from "../../utils/validation.utils";

import PrimaryButton from "../../components/buttons/PrimaryButton";

export default function LoginPage() {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { setAuthenticatedUser } = useAuth();

  const [searchParams] = useSearchParams();

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const {
    control,
    handleSubmit,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },

    mode: "onTouched",
  });

  /*
   * ============================================================
   * SESSION EXPIRED MESSAGE
   * ============================================================
   */

  useEffect(() => {
    if (
      searchParams.get("sessionExpired") === "true"
    ) {
      enqueueSnackbar(
        "Your session has expired. Please sign in again.",
        {
          variant: "warning",
        }
      );
    }
  }, [
    enqueueSnackbar,
    searchParams,
  ]);

  /*
   * ============================================================
   * LOGIN MUTATION
   * ============================================================
   */

  const loginMutation = useMutation({
    mutationFn: loginApi,

    onSuccess: (response) => {
      /*
       * BACKEND RESPONSE:
       *
       * token
       * tokenType
       * userId
       * orgId
       * firstName
       * lastName
       * userName
       * email
       * role
       * status
       */

      setAuthenticatedUser(response);

      enqueueSnackbar(
        `Welcome ${
          response.firstName ||
          response.userName
        }`,
        {
          variant: "success",
        }
      );

      /*
       * ADMIN
       */

      if (
        response.role === UserRole.ADMIN
      ) {
        navigate(
          ROUTES.ADMIN.DASHBOARD,
          {
            replace: true,
          }
        );

        return;
      }

      /*
       * PROJECT MANAGER
       */

      if (
        response.role ===
        UserRole.PROJECT_MANAGER
      ) {
        navigate(
          ROUTES.PROJECT_MANAGER.DASHBOARD,
          {
            replace: true,
          }
        );

        return;
      }

      /*
       * UNKNOWN ROLE
       */

      enqueueSnackbar(
        "Unsupported account role.",
        {
          variant: "error",
        }
      );
    },

    onError: (error) => {
      enqueueSnackbar(
        getErrorMessage(error),
        {
          variant: "error",
        }
      );
    },
  });

  /*
   * ============================================================
   * SUBMIT
   * ============================================================
   */

  const onSubmit = (
    values: LoginFormValues
  ) => {
    loginMutation.mutate(values);
  };

  return (
    <Box>
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontSize: "0.73rem",
            fontWeight: 750,
            color: "secondary.main",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Secure Workspace
        </Typography>

        <Typography
          variant="h4"
          sx={{
            mt: 0.8,
          }}
        >
          Welcome back
        </Typography>

        <Typography
          sx={{
            mt: 1,
            color: "text.secondary",
            fontSize: "0.87rem",
          }}
        >
          Sign in with your registered
          email to continue.
        </Typography>
      </Box>

      {/* ====================================================== */}
      {/* LOGIN FORM */}
      {/* ====================================================== */}

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Stack spacing={2.3}>

          {/* ================================================== */}
          {/* EMAIL */}
          {/* ================================================== */}

          <Controller
            name="email"
            control={control}
            render={({
              field,
              fieldState,
            }) => (
              <TextField
                  {...field}
                  fullWidth
                  size="small"
                  label="Email *"
                  type="text"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={field.value ?? ""}

                  helperText={fieldState.error?.message}

                  slotProps={{
                    htmlInput: {
                      maxLength: 100,
                    },

                    formHelperText: {
                      sx: {
                        color: "error.main",
                      },
                    },
                  }}

                  onChange={(event) => {
                    const value = event.target.value;

                    if (allowEmailInput(value)) {
                      field.onChange(value);
                    }
                  }}
              />
            )}
          />

          {/* ================================================== */}
          {/* PASSWORD */}
          {/* ================================================== */}

          <Controller
            name="password"
            control={control}
            render={({
              field,
              fieldState,
            }) => (
              <TextField
                {...field}
                fullWidth
                size="small"
                label="Password *"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={field.value ?? ""}

                helperText={fieldState.error?.message}

                slotProps={{
                  htmlInput: {
                    maxLength: 50,
                  },

                  formHelperText: {
                    sx: {
                      color: "error.main",
                    },
                  },

                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          size="small"
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          onClick={() =>
                            setShowPassword((previous) => !previous)
                          }
                          onMouseDown={(event) => {
                            event.preventDefault();
                          }}
                        >
                          {showPassword ? (
                            <VisibilityOffOutlined fontSize="small" />
                          ) : (
                            <VisibilityOutlined fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}

                onChange={(event) => {
                  const value = event.target.value;

                  if (allowPasswordInput(value)) {
                    field.onChange(value);
                  }
                }}
              />
            )}
          />

          {/* ================================================== */}
          {/* FORGOT PASSWORD */}
          {/* ================================================== */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              component={Link}
              to={ROUTES.FORGOT_PASSWORD}
              size="small"
              sx={{
                px: 0,
                minHeight: 0,
              }}
            >
              Forgot password?
            </Button>
          </Box>

          {/* ================================================== */}
          {/* SIGN IN */}
          {/* ================================================== */}

          <PrimaryButton
            type="submit"
            fullWidth
            size="large"
            loading={
              loginMutation.isPending
            }
            startIcon={
              !loginMutation.isPending ? (
                <LoginRounded />
              ) : undefined
            }
          >
            Sign In
          </PrimaryButton>

        </Stack>
      </Box>

      {/* ====================================================== */}
      {/* REGISTER ORGANIZATION */}
      {/* ====================================================== */}

      <Divider sx={{ my: 3 }}>
        <Typography
          sx={{
            color: "text.disabled",
            fontSize: "0.72rem",
          }}
        >
          NEW ORGANIZATION
        </Typography>
      </Divider>

      <Typography
        sx={{
          textAlign: "center",
          color: "text.secondary",
          fontSize: "0.84rem",
        }}
      >
        Need access?{" "}

        <Button
          component={Link}
          to={ROUTES.REGISTER}
          size="small"
          sx={{
            px: 0.5,
            minHeight: 0,
          }}
        >
          Register organization
        </Button>
      </Typography>
    </Box>
  );
}