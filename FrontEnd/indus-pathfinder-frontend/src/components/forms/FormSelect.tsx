import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

interface SelectOption {
  label: string;
  value: number | string;
}

interface FormSelectProps<
  TFieldValues extends FieldValues
> {
  name: FieldPath<TFieldValues>;

  control: Control<
    TFieldValues,
    any,
    any
  >;

  label: string;

  options: SelectOption[];

  numeric?: boolean;

  disabled?: boolean;
}

export default function FormSelect<
  TFieldValues extends FieldValues
>({
  name,
  control,
  label,
  options,
  numeric = false,
  disabled = false,
}: FormSelectProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field,
        fieldState,
      }) => (
        <FormControl
          fullWidth
          size="small"

          // Keep border and label normal
          error={false}

          disabled={disabled}
        >
          <InputLabel>
            {label}
          </InputLabel>

          <Select
            label={label}
            value={
              field.value ?? ""
            }
            onBlur={
              field.onBlur
            }
            onChange={(
              event
            ) => {
              const value =
                event.target.value;

              field.onChange(
                numeric
                  ? Number(value)
                  : value
              );
            }}
          >
            <MenuItem value="">
              <em>Select</em>
            </MenuItem>

            {options.map(
              (option) => (
                <MenuItem
                  key={
                    option.value
                  }
                  value={
                    option.value
                  }
                >
                  {
                    option.label
                  }
                </MenuItem>
              )
            )}
          </Select>

          <FormHelperText
            sx={{
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
            }}
          >
            {
              fieldState.error
                ?.message ?? " "
            }
          </FormHelperText>
        </FormControl>
      )}
    />
  );
}