import { Box, Button, Grid, Typography } from "@mui/material";
import "./styles/inactivity-logout.styles.css";
import { useNavigate } from "react-router-dom";

function InactivityLogout() {
  const navigate = useNavigate();
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} className="item">
          <Typography variant="h5">
            <b>You have been logged out!</b>
          </Typography>
        </Grid>
        <Grid item xs={12} className="item">
          <Typography variant="body2">
            Your Session has expired. Please sign in again!
          </Typography>
        </Grid>
        <Grid item xs={12} className="item">
          <Button
            onClick={() => navigate("/login")}
            variant="outlined"
            size="large"
            style={{
              border: "none",
              background: "#5a5a5a",
              outline: "none",
              borderRadius: 6,
            }}
            sx={{ textTransform: "false", mt: "2rem" }}
          >
            <Typography variant="body2" color="white">
              <b>Go to Sign in</b>
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default InactivityLogout;
