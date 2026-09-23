import {
    ArrowBackRounded,
  } from "@mui/icons-material";
  
  import {
    Button,
  } from "@mui/material";
  
  import {
    useNavigate,
  } from "react-router-dom";
  
  interface BackButtonProps {
    fallbackPath?: string;
  }
  
  export default function BackButton({
    fallbackPath,
  }: BackButtonProps) {
    const navigate = useNavigate();
  
    const handleBack = () => {
      if (fallbackPath) {
        navigate(fallbackPath);
        return;
      }
  
      navigate(-1);
    };
  
    return (
      <Button
        startIcon={<ArrowBackRounded />}
        onClick={handleBack}
        color="inherit"
        sx={{
          color: "text.secondary",
  
          "&:hover": {
            color: "text.primary",
            backgroundColor:
              "rgba(23,59,115,0.05)",
          },
        }}
      >
        Back
      </Button>
    );
  }