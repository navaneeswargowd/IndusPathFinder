import {
    AxiosError,
  } from "axios";
  
  interface BackendErrorResponse {
    message?: string;
    error?: string;
  }
  
  export function getErrorMessage(
    error: unknown
  ): string {
    if (
      error instanceof AxiosError
    ) {
      const data =
        error.response
          ?.data as BackendErrorResponse;
  
      return (
        data?.message ||
        data?.error ||
        error.message ||
        "Unable to complete the request."
      );
    }
  
    if (error instanceof Error) {
      return error.message;
    }
  
    return "An unexpected error occurred.";
  }