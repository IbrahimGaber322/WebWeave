
import { createTheme } from "@mui/material/styles";

  const theme = createTheme({
    palette: {
      mode: "dark",
      primary: {
          main: "#03a9f4",
          contrastText: "#fff",
      },
      secondary: {
          main: "#e91e63",
          contrastText: "#fff",
      },
      background: {
          default: "#212121",
          paper: "#242424",
      },
      success: {
          main: "#67be23",
          contrastText: "#fff",
      },
      error: {
          main: "#ee2a1e",
          contrastText: "#fff",
      },
      warning: {
          main: "#fa8c16",
          contrastText: "#fff",
      },
      info: {
          main: "#1890ff",
          contrastText: "#fff",
      },
      divider: "rgba(0,0,0,0)",
      text: {
          primary: "#fff",
          secondary: "rgba(255,255,255,0.7)",
          disabled: "#d1d1d1",
      },
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