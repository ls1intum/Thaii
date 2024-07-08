import { Button, Stack, Typography, useTheme } from "@mui/material";
import { Suspense } from "react";
import { DateRangePicker } from "rsuite";
import LoadingComponent from "../../general/loading-component/loading.component";
import FilterAutocomplete from "./filter-autocomplete/filter-autocomplete.component";
import { TagDTO } from "../../pages/types/pages.types";
import { LabelDTO } from "../../../types/chatbot/chatbot.types";
import "../styles/statistics.styles.css";
import { useToolStore } from "../../../states/global.store";

function Filter({ pages, labels, tags, handleReset }: any) {
  const theme = useTheme();
  const setFilterPageIds = useToolStore((state: any) => state.setFilterPageIds);
  const setFilterLabelsIds = useToolStore(
    (state: any) => state.setFilterLabelsIds
  );
  const setFilterTagsIds = useToolStore((state: any) => state.setFilterTagsIds);
  const setFilterDate = useToolStore((state: any) => state.setFilterDate);
  const selectedPagesId = useToolStore((state: any) => state.selectedPagesId);
  const setSelectedPagesId = useToolStore(
    (state: any) => state.setSelectedPagesId
  );
  const selectedLabelsId = useToolStore((state: any) => state.selectedLabelsId);
  const setSelectedLabelsId = useToolStore(
    (state: any) => state.setSelectedLabelsId
  );
  const selectedTagsId = useToolStore((state: any) => state.selectedTagsId);
  const setSelectedTagsId = useToolStore(
    (state: any) => state.setSelectedTagsId
  );
  const selectedPages = useToolStore((state: any) => state.selectedPages);
  const setSelectedPages = useToolStore((state: any) => state.setSelectedPages);
  const selectedTags = useToolStore((state: any) => state.selectedTags);
  const setSelectedTags = useToolStore((state: any) => state.setSelectedTags);
  const selectedLabels = useToolStore((state: any) => state.selectedLabels);
  const setSelectedLabels = useToolStore(
    (state: any) => state.setSelectedLabels
  );
  const dateRange = useToolStore((state: any) => state.dateRange);
  const setDateRange = useToolStore((state: any) => state.setDateRange);
  const includeUnlabeled = useToolStore((state: any) => state.includeUnlabeled);
  const includeUntagged = useToolStore((state: any) => state.includeUntagged);
  const setIncludeUnlabeled = useToolStore(
    (state: any) => state.setIncludeUnlabeled
  );
  const setIncludeUntagged = useToolStore(
    (state: any) => state.setIncludeUntagged
  );
  const { afterToday } = DateRangePicker;

  const handleApplyFilters = () => {
    setFilterPageIds(selectedPagesId);
    setFilterLabelsIds(
      labels
        .filter((label: LabelDTO) => selectedLabelsId.indexOf(label.id) !== -1)
        .map((element: LabelDTO) => element.id)
    );
    setFilterTagsIds(
      tags
        .filter((tag: TagDTO) => selectedTagsId.indexOf(tag.id) !== -1)
        .map((element: TagDTO) => element.id)
    );
    setFilterDate(dateRange);
  };

  return (
    <Stack direction="row" spacing={1}>
      <DateRangePicker
        format="dd.MM.yyyy"
        character=" - "
        size="md"
        value={dateRange}
        onChange={setDateRange}
        shouldDisableDate={afterToday()}
      />
      <Suspense fallback={<LoadingComponent />}>
        <FilterAutocomplete
          elements={pages}
          selectedElements={selectedPages}
          setSelectedElements={setSelectedPages}
          selectedItemId={selectedPagesId}
          setSelectedItemId={setSelectedPagesId}
          type="pages"
        />
      </Suspense>
      <Suspense fallback={<LoadingComponent />}>
        <FilterAutocomplete
          elements={labels}
          selectedElements={selectedLabels}
          setSelectedElements={setSelectedLabels}
          selectedItemId={selectedLabelsId}
          setSelectedItemId={setSelectedLabelsId}
          type="labels"
          includeUnlabeled={includeUnlabeled}
          setIncludeUnlabeled={setIncludeUnlabeled}
        />
      </Suspense>
      <Suspense fallback={<LoadingComponent />}>
        <FilterAutocomplete
          elements={tags}
          selectedElements={selectedTags}
          setSelectedElements={setSelectedTags}
          selectedItemId={selectedTagsId}
          setSelectedItemId={setSelectedTagsId}
          type="tags"
          includeUnlabeled={includeUntagged}
          setIncludeUnlabeled={setIncludeUntagged}
        />
      </Suspense>
      <Button
        variant="outlined"
        size="small"
        className="filter button"
        onClick={handleReset}
      >
        <Typography variant="caption" color={theme.palette.secondary.dark}>
          <b>Reset Filters</b>
        </Typography>
      </Button>
      <Button
        variant="outlined"
        size="small"
        className="filter button"
        onClick={handleApplyFilters}
      >
        <Typography variant="caption" color={theme.palette.secondary.dark}>
          <b>Apply Filters</b>
        </Typography>
      </Button>
    </Stack>
  );
}

export default Filter;
