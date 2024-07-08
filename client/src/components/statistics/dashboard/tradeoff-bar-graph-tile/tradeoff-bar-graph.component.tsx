import { Grid, Paper, Stack, Typography, useTheme } from "@mui/material";
import { GraphParams } from "../../../../types/statistics/statistics.types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function TradeoffBarGraph({ value, state, setState, title, labels }: GraphParams) {
  const theme = useTheme();
  return (
    <Paper className="tile line">
      <Grid container>
        <Grid item xs={12}>
          <Stack direction="row" spacing={1}>
            <Typography variant="h6" color={theme.palette.secondary.dark}>
              <b> {title} </b>
            </Typography>
            <Typography
              variant="h6"
              color={
                state === 0
                  ? theme.palette.secondary.dark
                  : theme.palette.primary.dark
              }
              onClick={() => setState(0)}
              sx={{ ":hover": { cursor: "pointer" } }}
            >
              <b>[ Pages</b>
            </Typography>
            <Typography
              variant="h6"
              color={
                state === 1
                  ? theme.palette.secondary.dark
                  : theme.palette.primary.dark
              }
              onClick={() => setState(1)}
              sx={{ ":hover": { cursor: "pointer" } }}
            >
              <b>Labels</b>
            </Typography>
            <Typography
              variant="h6"
              color={
                state === 2
                  ? theme.palette.secondary.dark
                  : theme.palette.primary.dark
              }
              onClick={() => setState(2)}
              sx={{ ":hover": { cursor: "pointer" } }}
            >
              <b>Tags</b>
            </Typography>
            <Typography variant="h6" color={theme.palette.secondary.dark}>
              <b>]</b>
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
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_emission" fill="#8884d8" name={labels[0]}/>
              <Bar dataKey="total_water_waste" fill="#82ca9d" name={labels[1]}/>
              <Bar dataKey="total_cost" fill="#ffc658" name={labels[2]}/>
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default TradeoffBarGraph;
