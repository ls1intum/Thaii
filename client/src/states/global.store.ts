import { create } from "zustand";
import { PageDTO, TagDTO } from "../components/pages/types/pages.types";
import { LabelDTO } from "../types/chatbot/chatbot.types";
// Define types for ToolStore
interface ToolStore {
  currentPageId: number;
  setCurrentPageId: (pageId: number) => void;
  pages: PageDTO[];
  setPages: (pages: PageDTO[]) => void;
  currentChatId: number;
  setCurrentChatId: (chatId: number) => void;
  chats: any[];
  setChats: (chats: any[]) => void;
  filterDate: any[] | null;
  setFilterDate: (date: any[] | null) => void;
  filterPageIds: number[];
  setFilterPageIds: (pageIds: number[]) => void;
  filterLabelsIds: number[];
  setFilterLabelsIds: (labelIds: number[]) => void;
  filterTagsIds: number[];
  setFilterTagsIds: (tagsIds: number[]) => void;
  selectedLabelsId: number[];
  setSelectedLabelsId: (labelsId: number[]) => void;
  selectedTagsId: number[];
  setSelectedTagsId: (selTagsId: number[]) => void;
  selectedPagesId: number[];
  setSelectedPagesId: (selPagesId: number[]) => void;
  selectedPages: PageDTO[];
  setSelectedPages: (selPages: PageDTO[]) => void;
  selectedLabels: LabelDTO[];
  setSelectedLabels: (selLabels: LabelDTO[]) => void;
  selectedTags: TagDTO[];
  setSelectedTags: (selTags: TagDTO[]) => void;
  dateRange: any[] | null;
  setDateRange: (dateRangeParam: any[]) => void;
  includeUnlabeled: boolean;
  setIncludeUnlabeled: (incUnlabeled: boolean) => void;
  includeUntagged: boolean;
  setIncludeUntagged: (incUntagged: boolean) => void;
  limit: number;
  setLimit: (chatLimit: number) => void;
  set: (newState: Partial<ToolStore>) => void;
}

// Define types for AuthStore
interface AuthStore {
  authenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
}


export const useToolStore = create<ToolStore>((set) => ({
  currentPageId: -1,
  setCurrentPageId: (pageId) => set({ currentPageId: pageId }),
  pages: [],
  setPages: (pages) => set({ pages }),
  currentChatId: -1,
  setCurrentChatId: (chatId) => set({ currentChatId: chatId }),
  chats: [],
  setChats: (chats) => set({ chats }),
  filterDate: null,
  setFilterDate: (date) => set({ filterDate: date }),
  filterPageIds: [],
  setFilterPageIds: (pageIds) => set({ filterPageIds: pageIds }),
  filterLabelsIds: [],
  setFilterLabelsIds: (labelIds) => set({ filterLabelsIds: labelIds }),
  filterTagsIds: [],
  setFilterTagsIds: (tagsIds) => set({ filterTagsIds: tagsIds }),
  selectedLabelsId: [],
  setSelectedLabelsId: (labelsId) => set({ selectedLabelsId: labelsId }),
  selectedTagsId: [],
  setSelectedTagsId: (selTagsId) => set({ selectedTagsId: selTagsId }),
  selectedPagesId: [],
  setSelectedPagesId: (selPagesId) => set({ selectedPagesId: selPagesId }),
  selectedPages: [],
  setSelectedPages: (selPages) => set({ selectedPages: selPages }),
  selectedLabels: [],
  setSelectedLabels: (selLabels) => set({ selectedLabels: selLabels }),
  selectedTags: [],
  setSelectedTags: (selTags) => set({ selectedTags: selTags }),
  dateRange: null,
  setDateRange: (dateRangeParam) => set({ dateRange: dateRangeParam }),
  includeUnlabeled: true,
  setIncludeUnlabeled: (incUnlabeled) => set({ includeUnlabeled: incUnlabeled }),
  includeUntagged: true,
  setIncludeUntagged: (incUntagged) => set({ includeUntagged: incUntagged }),
  limit: 6,
  setLimit: (chatLimit) => set({ limit: chatLimit }),
  set: (newState) => set((state) => ({ ...state, ...newState })),
}));

export const useAuthStore = create<AuthStore>((set) => ({
  authenticated: false,
  setAuthenticated: (auth: boolean) => set({ authenticated: auth }),
}));