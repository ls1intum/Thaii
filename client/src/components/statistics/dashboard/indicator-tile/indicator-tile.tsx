import { Grid, Paper, Typography, useTheme } from "@mui/material"
import "../../styles/statistics.styles.css"

function IndicatorTile({value, info}: any) {
    const theme = useTheme()
    return (
        <Paper className="dashboard tile">
            <Grid container className="tile container">
                <Grid item xs={12} className="tile container">
                    <Typography variant="h3" color={theme.palette.secondary.dark}><b>{value}</b></Typography>
                </Grid>
                <Grid item xs={12} className="tile container">
                    <Typography variant="body2" color={theme.palette.primary.dark}>{info}</Typography>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default IndicatorTile;