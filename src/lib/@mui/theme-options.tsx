import type { ThemeOptions } from "@mui/material";

export const themeOptions: ThemeOptions = {
  components: {
    MuiCssBaseline: {
      styleOverrides(theme) {
        return {
          "html, body, #root": {
            height: "100%",
            backgroundColor: theme.palette.grey[100],
            fontSize: "14px",
          },
        };
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          minHeight: 100,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 100,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: "contained",
      },
    },
  
    MuiButtonGroup: {
      defaultProps: {
        disableElevation: true,
        variant: "contained",
      },
    },
    MuiPaper: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiTextField: {
      defaultProps: {
        InputLabelProps: {
          shrink: true,
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
};
