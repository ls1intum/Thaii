import { Grid, Paper, Stack, Typography, useTheme } from "@mui/material";
import { SingleBarGraphParams } from "../../../../types/statistics/statistics.types";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

function SingleBarGraph({value, title, label}: SingleBarGraphParams) {
const theme = useTheme()
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
            <BarChart
              width={500}
              height={300}
              data={value}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="keyword" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="frequency" fill="#8884d8" name={label}/>
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default SingleBarGraph;
