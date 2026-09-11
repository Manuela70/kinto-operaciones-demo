import { createTheme } from '@mui/material/styles';

export const kintoTheme = createTheme({
  palette: {
    primary: {
      main: '#00495a',      // Dark teal-navy — nav bar background (per mockup)
      contrastText: '#fff',
    },
    secondary: {
      main: '#0097a7',       // Teal accent — Guardar / Cargar CTAs (per mockup)
    },
    info: {
      main: '#0097a7',       // Teal accent — CTAs (Buscar), partial-save dialog
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 13,
  },
  components: {
    /* Ensure the app body respects 1280px minimum */
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minWidth: 1280,
        },
      },
    },
    /* Compact, consistent table cells */
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem',
          padding: '6px 12px',
        },
        head: {
          fontWeight: 700,
        },
      },
    },
    /* Subtle row hover */
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.MuiTableRow-hover:hover': {
            backgroundColor: 'rgba(0, 151, 167, 0.04)',
          },
        },
      },
    },
    /* Dialogs: prevent horizontal scroll inside modals */
    MuiDialog: {
      styleOverrides: {
        paper: {
          overflowX: 'hidden',
        },
      },
    },
    /* Compact form controls to match mockup density */
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
    },
    /* Button text casing */
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});
