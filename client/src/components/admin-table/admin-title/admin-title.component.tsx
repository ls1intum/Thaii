import { Box, Grid, Typography, useTheme } from "@mui/material";

function AdminTitle() {
    const theme = useTheme()
    return (
        <Box sx={{height: "10vh", mt: "4rem"}}>
            <Grid container>
                <Grid item xs={12}>
                <Typography variant="h4" color={theme.palette.secondary.dark}><b>Admin Table</b></Typography>
                </Grid>
                <Grid item xs={12}><Typography variant="body2" color={theme.palette.primary.dark}>This is the admin table. </Typography></Grid>
            </Grid>
        </Box>
    )
}

export default AdminTitle;