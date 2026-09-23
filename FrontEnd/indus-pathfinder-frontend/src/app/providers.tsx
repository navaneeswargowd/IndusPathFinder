import type {
  PropsWithChildren,
} from "react";

import {
  CssBaseline,
  IconButton,
  ThemeProvider,
} from "@mui/material";

import CloseRoundedIcon
  from "@mui/icons-material/CloseRounded";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  SnackbarProvider,
  closeSnackbar,
} from "notistack";

import {
  theme,
} from "./theme";

import AuthProvider
  from "../auth/AuthProvider";

const queryClient =
  new QueryClient({
    defaultOptions: {
      queries: {
        retry:
          1,

        refetchOnWindowFocus:
          false,

        staleTime:
          30_000,
      },

      mutations: {
        retry:
          0,
      },
    },
  });

export function AppProviders({
  children,
}: PropsWithChildren) {
  return (
    <ThemeProvider
      theme={
        theme
      }
    >
      <CssBaseline />

      <QueryClientProvider
        client={
          queryClient
        }
      >
        <SnackbarProvider
          maxSnack={
            3
          }
          autoHideDuration={
            3000
          }
          anchorOrigin={{
            vertical:
              "top",

            horizontal:
              "right",
          }}
          action={(
            snackbarId
          ) => (
            <IconButton
              size="small"
              aria-label="Close notification"
              onClick={() =>
                closeSnackbar(
                  snackbarId
                )
              }
              sx={{
                color:
                  "inherit",
              }}
            >
              <CloseRoundedIcon
                fontSize="small"
              />
            </IconButton>
          )}
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}