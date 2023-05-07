import { createTheme } from "@mui/material/styles";

  const theme = createTheme({
    palette:{
        mode: "light",
    primary: {
        main: "#2196f3",
        contrastText: "#fff",
    },
    secondary: {
        main: "#e91e63",
        contrastText: "#fff",
    },
    background: {
        default: "#f0f0f0",
        paper: "#f0f0f0",
    },
    success: {
        main: "#67be23",
        contrastText: "#fff",
    },
    error: {
        main: "#fa541c",
        contrastText: "#fff",
    },
    warning: {
        main: "#fa8c16",
        contrastText: "#fff",
    },
    info: {
        main: "#0b82f0",
        contrastText: "#fff",
    },
    divider: "rgba(0,0,0,0)",
    text: {
        primary: "#292929",
        secondary: "#626262",
        disabled: "#c1c1c1",
    }
    },
    typography: {
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
      }
});

  export default theme;