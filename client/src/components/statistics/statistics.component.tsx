import { Grid, Paper, Stack, Typography } from "@mui/material";
import "../layout/styles/layout.styles.css";
import { SidebarParams } from "../../types/sidebar/sidebar.types";
import { lazy, Suspense, useEffect, useState } from "react";
import "rsuite/dist/rsuite.min.css";
import "./styles/statistics.styles.css";
import LoadingComponent from "../general/loading-component/loading.component";
import { LabelDTO } from "../../types/chatbot/chatbot.types";
import { getPagesForInsights } from "../../services/pages.service";
import { getLabels } from "../../services/label.service";
import { getTags } from "../../services/tags.service";
import { useToolStore } from "../../states/global.store";
import { addEventLog } from "../../services/interactions.service";
import { PageDTO, TagDTO } from "../../types/page/page.types";

const Filter = lazy(() => import("./filter/filter.component"));
const BehavioralDashboard = lazy(
  () => import("./dashboard/dashboard.component")
);
const TradeoffDashboard = lazy(
  () => import("./dashboard/tradeoff-dashboard/tradeoff-dashboard.component")
);
const PromptQualityDashboard = lazy(
  () =>
    import(
      "./dashboard/prompt-quality-dashboard/prompt-quality-dashboard.component"
    )
);

const tabs = [
  { tab: 0, name: "Behavioral Indicators" },
  { tab: 1, name: "Prompt Quality Indicators" },
  { tab: 2, name: "Tradeoff Indicators" },
];

function Statistics({ open }: SidebarParams) {
  const [tab, setTab] = useState(0);
  const [pages, setPages] = useState<PageDTO[]>([]);
  const [labels, setLabels] = useState<LabelDTO[]>([]);
  const [tags, setTags] = useState<TagDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const setFilterPageIds = useToolStore((state: any) => state.setFilterPageIds);
  const setFilterLabelsIds = useToolStore(
    (state: any) => state.setFilterLabelsIds
  );
  const setFilterTagsIds = useToolStore((state: any) => state.setFilterTagsIds);
  const setFilterDate = useToolStore((state: any) => state.setFilterDate);
  const setSelectedPagesId = useToolStore(
    (state: any) => state.setSelectedPagesId
  );
  const setSelectedLabelsId = useToolStore(
    (state: any) => state.setSelectedLabelsId
  );
  const setSelectedTagsId = useToolStore(
    (state: any) => state.setSelectedTagsId
  );
  const setSelectedPages = useToolStore((state: any) => state.setSelectedPages);
  const setSelectedTags = useToolStore((state: any) => state.setSelectedTags);
  const setSelectedLabels = useToolStore(
    (state: any) => state.setSelectedLabels
  );
  const setDateRange = useToolStore((state: any) => state.setDateRange);
  const setIncludeUnlabeled = useToolStore(
    (state: any) => state.setIncludeUnlabeled
  );
  const setIncludeUntagged = useToolStore(
    (state: any) => state.setIncludeUntagged
  );

  useEffect(() => {
    fetchPagesData();
    fetchLabelsData();
    fetchTagsData();
  }, []);

  const handleReset = () => {
    setDateRange(null);
    setSelectedPages(pages);
    setSelectedLabels(labels);
    setSelectedTags(tags);
    setSelectedPagesId(pages.map((element: PageDTO) => element.id));
    setSelectedTagsId(tags.map((element: TagDTO) => element.id));
    setSelectedLabelsId(labels.map((element: LabelDTO) => element.id));
    setFilterPageIds(pages.map((element: PageDTO) => element.id));
    setIncludeUnlabeled(true);
    setIncludeUntagged(true);
    setFilterLabelsIds(labels.map((element: LabelDTO) => element.id));
    setFilterTagsIds(tags.map((element: TagDTO) => element.id));
    setFilterDate(null);
  };

  const fetchPagesData = () => {
    getPagesForInsights().then((res: PageDTO[]) => setPages(res));
  };

  const fetchLabelsData = () => {
    getLabels().then((res: LabelDTO[]) => setLabels(res));
  };

  const fetchTagsData = () => {
    getTags().then((res: LabelDTO[]) => setTags(res));
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className={open ? "chat open" : "chat close"}>
      <Grid container className="main container">
        <Grid item xs={12}>
          <Typography variant="h4" color="#5a5a5a">
            <b>Insights</b>
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ mt: "1rem" }}>
          <Stack direction="row" spacing={2}>
            {tabs.map((tabItem: { tab: number; name: string }) => {
              return (
                <Paper
                  key={tabItem.name}
                  elevation={0}
                  className="main tabs"
                  onClick={() => {
                    setTab(tabItem.tab);
                    if (
                      (import.meta.env.VITE_ENABLE_TRACKING as string) == "true"
                    ) {
                      addEventLog({
                        location: "Insights - " + tabItem.name,
                      });
                    }
                  }}
                  sx={{
                    border: tabItem.tab === tab ? "solid 2px #7f7f7f" : 0,
                  }}
                >
                  <Typography variant="body1" color="#5a5a5a">
                    <b>{tabItem.name}</b>
                  </Typography>
                </Paper>
              );
            })}
          </Stack>
        </Grid>
        <Grid item xs={12} sx={{ mt: "2rem" }}>
          <Grid container>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-start", mr: "5vw" }}
            >
              <Suspense fallback={<LoadingComponent />}>
                <Filter
                  pages={pages}
                  labels={labels}
                  tags={tags}
                  setLoading={setLoading}
                  handleReset={handleReset}
                />
              </Suspense>
            </Grid>
          </Grid>
          {tab === 0 && (
            <Grid item xs={12} sx={{ mt: "4vh", mr: "5vw" }}>
              <Suspense fallback={<LoadingComponent />}>
                <BehavioralDashboard />
              </Suspense>
            </Grid>
          )}
          {tab === 1 && (
            <Grid item xs={12} sx={{ mt: "4vh", mr: "5vw" }}>
              <Suspense fallback={<LoadingComponent />}>
                <PromptQualityDashboard />
              </Suspense>
            </Grid>
          )}
          {tab === 2 && (
            <Grid item xs={12} sx={{ mt: "4vh", mr: "5vw" }}>
              <Suspense fallback={<LoadingComponent />}>
                <TradeoffDashboard />
              </Suspense>
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default Statistics;
