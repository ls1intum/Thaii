import { CircularProgress, Grid } from "@mui/material";

function LoadingComponent() {
  return (
    <Grid container sx={{ height: "10vh" }}>
      <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Grid>
    </Grid>
  );
}

export default LoadingComponent;
