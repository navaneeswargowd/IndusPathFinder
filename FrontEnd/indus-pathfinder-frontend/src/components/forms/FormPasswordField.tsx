import {
  IconButton,
  InputAdornment,
  TextField,
  type TextFieldProps,
} from "@mui/material";

import {
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

import {
  useState,
} from "react";

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

interface FormPasswordFieldProps<
  TFieldValues extends FieldValues
> {
  name:
    FieldPath<TFieldValues>;

  control:
    Control<
      TFieldValues,
      any,
      TFieldValues
    >;

  label: string;

  textFieldProps?:
    Omit<
      TextFieldProps,
      | "name"
      | "value"
      | "onChange"
      | "onBlur"
      | "type"
      | "error"
      | "helperText"
    >;
}

export default function FormPasswordField<
  TFieldValues extends FieldValues
>({
  name,
  control,
  label,
  textFieldProps,
}: FormPasswordFieldProps<TFieldValues>) {
  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field,
        fieldState,
      }) => (
        <TextField
          {...textFieldProps}
          {...field}
          label={label}
          type={
            showPassword
              ? "text"
              : "password"
          }
          fullWidth
          error={
            Boolean(
              fieldState.error
            )
          }
          helperText={
            fieldState.error
              ?.message
          }
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment
                  position="end"
                >
                  <IconButton
                    onClick={() =>
                      setShowPassword(
                        (
                          previous
                        ) =>
                          !previous
                      )
                    }
                    edge="end"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <VisibilityOffOutlined />
                    ) : (
                      <VisibilityOutlined />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  );
}