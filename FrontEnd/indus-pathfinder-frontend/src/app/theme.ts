import { alpha, createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"];
  }
}

const PRIMARY = "#173B73";
const PRIMARY_DARK = "#0B2347";
const SECONDARY = "#0D92B8";
const ACCENT = "#5B67F1";

export const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: PRIMARY,
      dark: PRIMARY_DARK,
      light: "#4C6FA8",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: SECONDARY,
      dark: "#086A87",
      light: "#56B9D3",
      contrastText: "#FFFFFF",
    },

    tertiary: {
      main: ACCENT,
    },

    success: {
      main: "#16836D",
    },

    warning: {
      main: "#D58A13",
    },

    error: {
      main: "#D14343",
    },

    info: {
      main: "#2878C7",
    },

    background: {
      default: "#F4F7FB",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#172033",
      secondary: "#687386",
    },

    divider: "#E4E9F0",
  },

  typography: {
    fontFamily:
      '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',

    h1: {
      fontSize: "2.25rem",
      fontWeight: 750,
      letterSpacing: "-0.04em",
    },

    h2: {
      fontSize: "1.85rem",
      fontWeight: 750,
      letterSpacing: "-0.035em",
    },

    h3: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },

    h4: {
      fontSize: "1.3rem",
      fontWeight: 700,
    },

    h5: {
      fontSize: "1.1rem",
      fontWeight: 700,
    },

    h6: {
      fontWeight: 700,
    },

    body1: {
      fontSize: "0.95rem",
      lineHeight: 1.6,
    },

    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.55,
    },

    button: {
      textTransform: "none",
      fontWeight: 650,
      letterSpacing: 0,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },

        html: {
          scrollBehavior: "smooth",
        },

        body: {
          margin: 0,
          minWidth: 320,
          minHeight: "100vh",
          backgroundColor: "#F4F7FB",
        },

        "#root": {
          minHeight: "100vh",
        },

        "::selection": {
          backgroundColor: alpha(SECONDARY, 0.22),
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          minHeight: 42,
          borderRadius: 10,
          paddingLeft: 18,
          paddingRight: 18,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid #E6EBF2",
          boxShadow: "0 8px 30px rgba(27, 51, 89, 0.06)",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#9AA9BE",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 1.5,
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          backgroundColor: "#F8FAFD",
          color: "#475467",
        },
      },
    },

    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
    },
  },
});