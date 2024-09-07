import { LabelDTO } from "../chatbot/chatbot.types";
import { TagDTO } from "../page/page.types";

export type CreationDialogParams = {
  open: boolean;
  setOpen: (open: boolean) => void;
  label: string;
  setLabel: (title: string) => void;
  parentId: number;
  selectedElements?: TagDTO[] | LabelDTO[];
  selectedTagOrLabel: string[];
  setSelectedTagOrLabel: (selectedTagOrLabel: string[]) => void;
  setParentId: (parentId: number) => void;
  createItem?: () => void;
  editItem?: () => void;
  deleteItem?: () => void;
  type: string;
  source: string;
};

export type TagLabelListParams = {
  elements: TagDTO[] | LabelDTO[];
  selectedElements: TagDTO[] | LabelDTO[];
  currentElements: TagDTO[] | LabelDTO[];
  setCurrentElements: (currentElement: TagDTO[] | LabelDTO[]) => void;
  selectedTagsOrLabels: string[];
  setSelectedTagsOrLabels: (selectedTagOrLabel: string[]) => void;
};

export type TagLabelDialogParams = {
  open: boolean;
  setOpen: (open: boolean) => void;
  anchor: HTMLButtonElement | null;
  fetchTagsOrLabels: () => void;
  source: string;
};

export type ColorSelectorParams = {
  color: string;
  setColor: (color: string) => void;
};
