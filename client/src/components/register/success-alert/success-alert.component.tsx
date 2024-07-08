import { Alert, Grid, Typography } from "@mui/material";

function SuccessAlert() {
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
      <Alert severity="success">
        <Typography variant="body2">
          Your account has been created successfully! Please check your email to
          confirm your email address and activate your account.
        </Typography>
      </Alert>
    </Grid>
  );
}

export default SuccessAlert;
