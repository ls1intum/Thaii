import { Box, Grid, Typography } from "@mui/material";
import "./styles/footer.styles.css";

function Footer() {
  return (
    <Box className="footer">
      <Grid container>
        <Grid item xs={12} className="item">
          <Typography variant="body2" color="white">
            <b>THAII</b> by LEAPS Research Group and Chair of Applied
            Software Engineering at <b>TUM</b>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Footer;
