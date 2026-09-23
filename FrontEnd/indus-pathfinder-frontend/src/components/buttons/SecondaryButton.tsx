import {
    Button,
    type ButtonProps,
  } from "@mui/material";
  
  export default function SecondaryButton(
    props: ButtonProps
  ) {
    return (
      <Button
        variant="outlined"
        {...props}
        sx={{
          minHeight: 44,
  
          borderColor: "#D6DEE8",
  
          color: "text.primary",
  
          "&:hover": {
            borderColor: "primary.main",
            backgroundColor:
              "rgba(23,59,115,0.04)",
          },
  
          ...props.sx,
        }}
      />
    );
  }