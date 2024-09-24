import { Dispatch, SetStateAction } from "react";

// DTOs
export type PageDTO = {
  id: string;
  label: string;
  children: string[];
  parent_page: number | null;
  level: number;
  read_only: boolean;
  tags: TagDTO[];
};

export type TagDTO = {
  id: string;
  label: string;
  color: string;
};

// Request Bodies
export type PageBody = {
  label: string;
  parent_page_id: number | null;
  tags: string[];
};

export type TagBody = {
  label: string;
  color: string;
};

// List Elements
export type TagList = {
  tags: TagDTO[];
  selectedTags: TagDTO[];
  setSelectedTags: Dispatch<SetStateAction<TagDTO[]>>;
};

// Function Parameter Definitions
export type PageDialogParams = {
  open: boolean;
  setOpen: (open: boolean) => void;
  label: string;
  setLabel: (title: string) => void;
  parentId: number;
  setParentId: (parentId: number) => void;
  createPage?: (e: any) => void;
  editPage?: (page: PageDTO) => void;
  deletePage?: (id: number) => void;
  pages: any;
  type: string;
};

export type PopperParams = {
  open: boolean;
  setOpen: (open: boolean) => void;
  anchor: HTMLButtonElement | null;
  fetchTags: () => Promise<void>;
  hasValue: (tag_name: string) => boolean;
};

export type ColorSelectorParams = {
  color: string;
  setColor: (color: string) => void;
};

export type TreeViewParams = {
  currentPageId: string;
  setCurrentPageId: (currentPageId: string) => void;
  isNewPage: boolean;
};

export type PageTitleParams = {
  currentPage: PageDTO;
  fetchPagesData: () => void;
  fetchPageById: (id: number) => void;
  setSnackbar: (snackbar: {
    message: string;
    type: string;
    open: boolean;
  }) => void;
};
