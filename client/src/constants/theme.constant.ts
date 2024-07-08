import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      dark: "#7f7f7f",
      main: "#2196f3",
      light: "#f5f5f5"
    },
    secondary: {
      dark: "#5a5a5a",
      light: "#d3d3d3",
      main: "#f3f3f3",
    }, 
  },
});

export { theme };
