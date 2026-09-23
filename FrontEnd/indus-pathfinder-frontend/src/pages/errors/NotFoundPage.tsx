import {
    Box,
    Button,
    Typography,
  } from "@mui/material";
  
  import {
    HomeOutlined,
  } from "@mui/icons-material";
  
  import {
    useNavigate,
  } from "react-router-dom";
  
  export default function NotFoundPage() {
    const navigate = useNavigate();
  
    return (
      <Box
        sx={{
          minHeight: "70vh",
  
          display: "flex",
          flexDirection: "column",
  
          alignItems: "center",
          justifyContent: "center",
  
          textAlign: "center",
  
          px: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "5rem",
              md: "7rem",
            },
  
            lineHeight: 1,
  
            fontWeight: 800,
  
            color: "primary.main",
  
            letterSpacing: "-0.08em",
          }}
        >
          404
        </Typography>
  
        <Typography
          variant="h4"
          sx={{ mt: 2 }}
        >
          Page not found
        </Typography>
  
        <Typography
          sx={{
            mt: 1,
  
            color: "text.secondary",
          }}
        >
          The page you requested does not
          exist or may have been moved.
        </Typography>
  
        <Button
          sx={{ mt: 3 }}
          variant="contained"
          startIcon={<HomeOutlined />}
          onClick={() => navigate("/")}
        >
          Go Home
        </Button>
      </Box>
    );
  }