import { PageDTO, TagDTO } from "../../components/pages/types/pages.types";
import { LabelDTO } from "../chatbot/chatbot.types";

export type PagesFilterParams = {
  elements: PageDTO[] | LabelDTO[] | TagDTO[];
  selectedElements: PageDTO[] | LabelDTO[] | TagDTO[];
  setSelectedElements: (elements: any) => void;
  selectedItemId: string[];
  setSelectedItemId: (elements: string[]) => void;
  type: string;
  includeUnlabeled?: boolean;
  setIncludeUnlabeled?: (element: boolean) => void;
};

export type FilterContextParams = {
  selectedLabelsId: string[];
  setSelectedLabelsId: (selectedLabelsId: string[]) => void;
  selectedTagsId: string[];
  setSelectedTagsId: (selectedTagsId: string[]) => void;
  selectedPagesId: string[];
  setSelectedPagesId: (selectedPagesId: string[]) => void;
};

export type FilterBody = {
  pages: string[];
  labels: string[];
  tags: string[];
  dateRange: Date[];
  includeUnlabeled: boolean;
  includeUntagged: boolean;
};

export type GraphParams = {
  value: any;
  state: number;
  setState: (state: number) => void;
  title: string;
  labels: string[];
};

export type SingleBarGraphParams = {
  value: any;
  title: string;
  label: string;
};

export type SentimentTileGraphParams = {
  value: {sentiment: string, frequency: number}[]
}