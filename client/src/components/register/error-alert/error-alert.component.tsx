import { Alert, Grid, Typography } from "@mui/material";

function ErrorAlert({ errorMsg }: any) {
  return (
    <Grid
      item
      xs={12}
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: "2rem",
      }}
    >
      <Alert severity="error">
        <Typography variant="body2">{errorMsg}</Typography>
      </Alert>
    </Grid>
  );
}

export default ErrorAlert;
