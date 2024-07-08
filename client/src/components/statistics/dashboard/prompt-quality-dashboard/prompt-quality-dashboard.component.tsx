import { Suspense } from "react";
import { useToolStore } from "../../../../states/global.store";
import {
  getCommonAdjectives,
  getCommonNouns,
  getCommonVerbs,
  getKeywords,
} from "../../../../services/insights.service";
import { Grid } from "@mui/material";
import SingleBarGraph from "../single-bar-graph/single-bar-graph.component";
import LoadingComponent from "../../../general/loading-component/loading.component";
import { useQuery } from "react-query";

function PromptQualityDashboard() {
  const filterPageIds = useToolStore((state: any) => state.filterPageIds);
  const filterLabelsIds = useToolStore((state: any) => state.filterLabelsIds);
  const filterTagsIds = useToolStore((state: any) => state.filterTagsIds);
  const filterDate = useToolStore((state: any) => state.filterDate);
  const includeUnlabeled = useToolStore((state: any) => state.includeUnlabeled);
  const includeUntagged = useToolStore((state: any) => state.includeUntagged);
  const commonFilters = {
    pages: filterPageIds,
    labels: filterLabelsIds,
    tags: filterTagsIds,
    dateRange: filterDate,
    includeUnlabeled,
    includeUntagged,
  };

  const { data: keywords } = useQuery(['keywords', commonFilters], () => getKeywords(commonFilters));
  const { data: commonNouns } = useQuery(['commonNouns', commonFilters], () => getCommonNouns(commonFilters));
  const { data: commonVerbs } = useQuery(['commonVerbs', commonFilters], () => getCommonVerbs(commonFilters));
  const { data: commonAdjectives } = useQuery(['commonAdjectives', commonFilters], () => getCommonAdjectives(commonFilters));

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Suspense fallback={<LoadingComponent />}>
          <SingleBarGraph
            value={keywords}
            title="Keywords in chats by Frequency-Inverse Document Frequency"
            label="Frequency-Inverse Document Frequency"
          />
        </Suspense>
      </Grid>
      <Grid item xs={6}>
        <Suspense fallback={<LoadingComponent />}>
          <SingleBarGraph
            value={commonNouns}
            title="Most common nouns in chats"
            label="Frequency"
          />
        </Suspense>
      </Grid>
      <Grid item xs={6}>
        <Suspense fallback={<LoadingComponent />}>
          <SingleBarGraph
            value={commonVerbs}
            title="Most common verbs in chats"
            label="Frequency"
          />
        </Suspense>
      </Grid>
      <Grid item xs={6}>
        <Suspense fallback={<LoadingComponent />}>
          <SingleBarGraph
            value={commonAdjectives}
            title="Most common adjectives in chats"
            label="Frequency"
          />
        </Suspense>
      </Grid>
    </Grid>
  );
}

export default PromptQualityDashboard;
