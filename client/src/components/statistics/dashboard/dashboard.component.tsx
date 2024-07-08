import { Grid } from "@mui/material";
import IndicatorTile from "./indicator-tile/indicator-tile";
import "../styles/statistics.styles.css";
import { useToolStore } from "../../../states/global.store";
import {
  getAvgChatDuration,
  getAvgChatDurationByItem,
  getChatsMessagesByItem,
  getChatsMessagesByTime,
  getTotalChats,
  getTotalMessages,
} from "../../../services/insights.service";
import { useEffect, useState } from "react";
import LineGraphTile from "./line-graph-tile/line-graph-tile.component";
import BarGraphTile from "./bar-graph-tile/bar-graph-tile.component";
import BarGraphAvgConvTile from "./bar-graph-avg-conv-time-tile/bar-graph-avg-conv-time-tile.component";
import { useQuery } from "react-query";

function BehavioralDashboard() {
  const filterPageIds = useToolStore((state: any) => state.filterPageIds);
  const filterLabelsIds = useToolStore((state: any) => state.filterLabelsIds);
  const filterTagsIds = useToolStore((state: any) => state.filterTagsIds);
  const filterDate = useToolStore((state: any) => state.filterDate);
  const includeUnlabeled = useToolStore((state: any) => state.includeUnlabeled);
  const includeUntagged = useToolStore((state: any) => state.includeUntagged);
  const [item, setItem] = useState<number>(0);
  const [itemDuration, setItemDuration] = useState<number>(0);
  const [time, setTime] = useState<number>(0);

  const commonFilters = {
    pages: filterPageIds,
    labels: filterLabelsIds,
    tags: filterTagsIds,
    dateRange: filterDate,
    includeUnlabeled,
    includeUntagged,
  };

  const { data: totalChats } = useQuery(['totalChats', commonFilters], () => getTotalChats(commonFilters));
  const { data: totalMessages } = useQuery(['totalMessages', commonFilters], () => getTotalMessages(commonFilters));
  const { data: chatsAndMessagesByTime } = useQuery(['chatsAndMessagesByTime', commonFilters, time], () => getChatsMessagesByTime(commonFilters, time));
  const { data: chatsAndMessagesByItem } = useQuery(['chatsAndMessagesByItem', commonFilters, item], () => getChatsMessagesByItem(commonFilters, item));
  const { data: avgConversationTime } = useQuery(['avgConversationTime', commonFilters], () => getAvgChatDuration(commonFilters));
  const { data: conversationDurationByItem } = useQuery(['conversationDurationByItem', commonFilters, itemDuration], () => getAvgChatDurationByItem(commonFilters, itemDuration));

  useEffect(() => {
    setItem(0);
    setItemDuration(0);
    setTime(0);
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <IndicatorTile value={totalChats} info="Total Chats" />
      </Grid>
      <Grid item xs={3}>
        <IndicatorTile value={totalMessages} info="Total Messages" />
      </Grid>
      <Grid item xs={3}>
        <IndicatorTile
          value={(totalMessages / totalChats).toFixed(2)}
          info="Avg Messages per Chat"
        />
      </Grid>
      <Grid item xs={3}>
        <IndicatorTile
          value={Number(avgConversationTime).toFixed(2)}
          info="Avg hours spent on Chat"
        />
      </Grid>
      <Grid item xs={12}>
        <LineGraphTile
          value={chatsAndMessagesByTime}
          state={time}
          setState={setTime}
          title="Total Chats and Messages by"
          labels={["Total Chat Count", "Total Message Count"]}
        />
      </Grid>
      <Grid item xs={6}>
        <BarGraphTile
          value={chatsAndMessagesByItem}
          state={item}
          setState={setItem}
          title="Total Chats and Messages by"
          labels={["Total Chat Count", "Total Message Count"]}
        />
      </Grid>
      <Grid item xs={6}>
        <BarGraphAvgConvTile
          value={conversationDurationByItem}
          state={itemDuration}
          setState={setItemDuration}
          title="Avg hours spent on Chat by"
          labels={["Average Hours spent on Chat"]}
        />
      </Grid>
    </Grid>
  );
}

export default BehavioralDashboard;
