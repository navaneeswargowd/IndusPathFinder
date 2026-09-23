// import {
//   TextField,
//   type TextFieldProps,
// } from "@mui/material";

// import {
//   Controller,
//   type Control,
//   type FieldPath,
//   type FieldValues,
// } from "react-hook-form";


// interface FormTextFieldProps<
//   TFieldValues extends FieldValues
// > {
//   name: FieldPath<TFieldValues>;

//   control: Control<TFieldValues>;

//   label: string;

//   allowValue?: (
//     value: string
//   ) => boolean;

//   transformInput?: (
//     value: string
//   ) => string;

//   textFieldProps?: Omit<
//     TextFieldProps,
//     | "name"
//     | "value"
//     | "onChange"
//     | "onBlur"
//     | "error"
//     | "helperText"
//   >;
// }


// export default function FormTextField<
//   TFieldValues extends FieldValues
// >({
//   name,
//   control,
//   label,
//   allowValue,
//   transformInput,
//   textFieldProps,
// }: FormTextFieldProps<TFieldValues>) {

//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({
//         field,
//         fieldState,
//       }) => {

//         const currentValue =
//           String(
//             field.value ?? ""
//           );


//         return (
//           <TextField
//             {...field}

//             {...textFieldProps}

//             fullWidth

//             size="small"

//             label={label}

//             value={
//               currentValue
//             }

//             onBlur={
//               field.onBlur
//             }

//             onChange={(
//               event: React.ChangeEvent<HTMLInputElement>
//             ) => {

//               let value =
//                 event.target.value;


//               /*
//                * Transform first.
//                *
//                * Example:
//                *
//                * abc123
//                *
//                * becomes:
//                *
//                * ABC123
//                */
//               if (
//                 transformInput
//               ) {
//                 value =
//                   transformInput(
//                     value
//                   );
//               }


//               /*
//                * Input filtering only.
//                *
//                * Validation messages
//                * come from Zod.
//                */
//               if (
//                 allowValue &&
//                 !allowValue(value)
//               ) {
//                 return;
//               }


//               field.onChange(
//                 value
//               );
//             }}


//             /*
//              * ZOD ERROR
//              *
//              * This is the ONLY
//              * validation error source.
//              */
//             error={
//               !!fieldState.error
//             }


//             helperText={
//               fieldState.error
//                 ?.message ?? " "
//             }


//             slotProps={{
//               ...textFieldProps
//                 ?.slotProps,

//               htmlInput: {
//                 ...textFieldProps
//                   ?.slotProps
//                   ?.htmlInput,
//               },

//               formHelperText: {
//                 sx: {
//                   fontSize:
//                     "0.72rem",

//                   mt: 0.5,

//                   ml: 0.2,
//                 },
//               },
//             }}
//           />
//         );
//       }}
//     />
//   );
// }



import {
  TextField,
  type TextFieldProps,
} from "@mui/material";

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";


interface FormTextFieldProps<
  TFieldValues extends FieldValues
> {
  name: FieldPath<TFieldValues>;

  control: Control<TFieldValues>;

  label: string;

  allowValue?: (
    value: string
  ) => boolean;

  transformInput?: (
    value: string
  ) => string;

  textFieldProps?: Omit<
    TextFieldProps,
    | "name"
    | "value"
    | "onChange"
    | "onBlur"
    | "error"
    | "helperText"
  >;
}


export default function FormTextField<
  TFieldValues extends FieldValues
>({
  name,
  control,
  label,
  allowValue,
  transformInput,
  textFieldProps,
}: FormTextFieldProps<TFieldValues>) {

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field,
        fieldState,
      }) => {

        const currentValue =
          String(
            field.value ?? ""
          );


        return (
          <TextField
            {...field}

            {...textFieldProps}

            fullWidth

            size="small"

            label={label}

            value={
              currentValue
            }

            onBlur={
              field.onBlur
            }

            onChange={(
              event: React.ChangeEvent<HTMLInputElement>
            ) => {

              let value =
                event.target.value;


              /*
               * Transform first.
               *
               * Example:
               *
               * abc123
               *
               * becomes:
               *
               * ABC123
               */
              if (
                transformInput
              ) {
                value =
                  transformInput(
                    value
                  );
              }


              /*
               * Input filtering only.
               *
               * Validation messages
               * come from Zod.
               */
              if (
                allowValue &&
                !allowValue(value)
              ) {
                return;
              }


              field.onChange(
                value
              );
            }}


            /*
             * ZOD ERROR MESSAGE
             *
             * Only helper text is red.
             * Border / label / placeholder
             * remain normal.
             */
            helperText={
              fieldState.error
                ?.message ?? " "
            }


            slotProps={{
              ...textFieldProps
                ?.slotProps,

              htmlInput: {
                ...textFieldProps
                  ?.slotProps
                  ?.htmlInput,
              },

              input: {
                ...textFieldProps
                  ?.slotProps
                  ?.input,
              },

              formHelperText: {
                ...textFieldProps
                  ?.slotProps
                  ?.formHelperText,

                sx: {
                  fontSize:
                    "0.72rem",

                  mt: 0.5,

                  ml: 0.2,

                  color:
                    fieldState.error
                      ? "error.main"
                      : "text.secondary",
                },
              },
            }}
          />
        );
      }}
    />
  );
}