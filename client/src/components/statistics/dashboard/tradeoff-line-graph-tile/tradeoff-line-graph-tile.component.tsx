import { Grid, Paper, Stack, Typography, useTheme } from "@mui/material";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GraphParams } from "../../../../types/statistics/statistics.types";

function TradeoffLineGraph({ value, state, setState, title, labels }: GraphParams) {
    const theme = useTheme();

    return (
      <Paper className="tile line">
        <Grid container>
          <Grid item xs={12}>
            <Stack direction="row" spacing={1}>
              <Typography variant="h6" color={theme.palette.secondary.dark}>
                <b>{title} [ </b>
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
                <b>Days</b>
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
                <b>Months</b>
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
                <b>Years</b>
              </Typography>
              <Typography variant="h6" color={theme.palette.secondary.dark}>
                <b>]</b>
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <ResponsiveContainer width="95%" height="95%">
              <LineChart data={value}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="create_date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total_emission"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name={labels[0]}
                />
                <Line type="monotone" dataKey="total_water_waste" stroke="#82ca9d" name={labels[1]}/>
                <Line type="monotone" dataKey="total_cost" stroke="#ffc658" name={labels[2]}/>
              </LineChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </Paper>
    )
}

export default TradeoffLineGraph;