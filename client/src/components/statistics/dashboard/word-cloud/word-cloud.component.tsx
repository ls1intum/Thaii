import { Grid, Paper, Stack, Typography, useTheme } from "@mui/material";
import { SingleBarGraphParams } from "../../../../types/statistics/statistics.types";
import ReactWordcloud from "react-wordcloud";
import { ResponsiveContainer } from "recharts";

function WordCloudGraph({ value, title }: SingleBarGraphParams) {
  const theme = useTheme();
  console.log(value);
  return (
    <Paper className="tile line">
      <Grid container>
        <Grid item xs={12}>
          <Stack direction="row" spacing={1}>
            <Typography variant="h6" color={theme.palette.secondary.dark}>
              <b> {title} </b>
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <ResponsiveContainer width="100%" height="100%">
            <ReactWordcloud words={value} />
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default WordCloudGraph;
