import { Box, Grid, Typography } from "@mui/material";
import "./styles/not-found.styles.css";
import { Frown } from "react-feather";

function NotFound() {
  return (
    <Box>
      <Grid container>
        <Grid item xs={12} className="container">
          <Frown size="100px" color="#7f7f7f" />
        </Grid>
        <Grid item xs={12} className="container">
          <Typography variant="h3">
            <b>404</b>
          </Typography>
        </Grid>
        <Grid item xs={12} className="container">
          <Typography variant="h5">
            <b>Page not found</b>
          </Typography>
        </Grid>
        <Grid item xs={12} className="container">
          <Typography variant="body2">
            The resource requested could not be found on this server!
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default NotFound;
