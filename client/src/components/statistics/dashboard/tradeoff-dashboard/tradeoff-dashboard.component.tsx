import { Grid } from "@mui/material";
import IndicatorTile from "../indicator-tile/indicator-tile";
import {
  getTotalCost,
  getTotalEmission,
  getTotalWaterWaste,
  getTradeoffIndicatorsByItem,
  getTradeoffIndicatorsByTime,
} from "../../../../services/insights.service";
import { useToolStore } from "../../../../states/global.store";
import { Suspense, useState } from "react";
import TradeoffLineGraph from "../tradeoff-line-graph-tile/tradeoff-line-graph-tile.component";
import LoadingComponent from "../../../general/loading-component/loading.component";
import TradeoffBarGraph from "../tradeoff-bar-graph-tile/tradeoff-bar-graph.component";
import { useQuery } from "react-query";

function TradeoffDashboard() {
  const filterPageIds = useToolStore((state: any) => state.filterPageIds);
  const filterLabelsIds = useToolStore((state: any) => state.filterLabelsIds);
  const filterTagsIds = useToolStore((state: any) => state.filterTagsIds);
  const filterDate = useToolStore((state: any) => state.filterDate);
  const includeUnlabeled = useToolStore((state: any) => state.includeUnlabeled);
  const includeUntagged = useToolStore((state: any) => state.includeUntagged);
  const [date, setDate] = useState(0);
  const [item, setItem] = useState(0);

  const commonFilters = {
    pages: filterPageIds,
    labels: filterLabelsIds,
    tags: filterTagsIds,
    dateRange: filterDate,
    includeUnlabeled,
    includeUntagged,
  };

  const { data: totalEmission } = useQuery(['totalEmission', commonFilters], () => getTotalEmission(commonFilters));
  const { data: totalWaterWaste } = useQuery(['totalWaterWaste', commonFilters], () => getTotalWaterWaste(commonFilters));
  const { data: totalCost } = useQuery(['totalCost', commonFilters], () => getTotalCost(commonFilters));
  const { data: tradeoffIndicatorsByTime } = useQuery(['tradeoffIndicatorsByTime', commonFilters, date], () => getTradeoffIndicatorsByTime(commonFilters, date));
  const { data: tradeoffIndicatorsByItem } = useQuery(['tradeoffIndicatorsByItem', commonFilters, item], () => getTradeoffIndicatorsByItem(commonFilters, item));
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Suspense fallback={<LoadingComponent />}>
          <IndicatorTile
            value={Number(totalEmission).toFixed(2)}
            info="estimated grams of CO2 used"
          />
        </Suspense>
      </Grid>
      <Grid item xs={4}>
        <Suspense fallback={<LoadingComponent />}>
          <IndicatorTile
            value={Number(totalWaterWaste).toFixed(2)}
            info="estimated ml of water used"
          />
        </Suspense>
      </Grid>
      <Grid item xs={4}>
        <Suspense fallback={<LoadingComponent />}>
          <IndicatorTile
            value={Number(totalCost).toFixed(3)}
            info="$ of cost for the page provider"
          />
        </Suspense>
      </Grid>
      <Grid item xs={12}>
        <Suspense fallback={<LoadingComponent />}>
          <TradeoffLineGraph
            value={tradeoffIndicatorsByTime}
            state={date}
            setState={setDate}
            title={"Tradeoff Indicators by"}
            labels={["Total Emissions of CO2 in gram", "Total Water used in ml", "Total Cost for Page Provider"]}
          />
        </Suspense>
      </Grid>
      <Grid item xs={12}>
        <Suspense fallback={<LoadingComponent />}>
          <TradeoffBarGraph
            value={tradeoffIndicatorsByItem}
            state={item}
            setState={setItem}
            title={"Tradeoff Indicators by"}
            labels={["Total Emissions of CO2 in gram", "Total Water used in ml", "Total Cost for Page Provider"]}
          />
        </Suspense>
      </Grid>
    </Grid>
  );
}

export default TradeoffDashboard;
