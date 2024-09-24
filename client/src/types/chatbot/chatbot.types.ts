import { PageDTO } from "../page/page.types";

export type LabelDTO = {
  id: string;
  label: string;
  color: string;
};

export type ChatDTO = {
  id: number;
  title: string;
  page: PageDTO;
  labels: LabelDTO[];
};

export type ChatBody = {
  title: string;
  page: number;
  labels: string[];
};

export type MessageDTO = {
  id: number;
  request: string;
  response: string;
  chat: number;
};

export type MessageBody = {
  request: string;
};

export type LabelBody = {
  label: string;
  color: string;
};

export type ChatDialogParams = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  parentId: number;
  setParentId: (parentId: number) => void;
  createChat: (e: any) => void;
};

export type ChatListParams = {
  chats: ChatDTO[];
  currentChatId: number;
  setCurrentChatId: (currentChatId: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
};

export type ChatTitleParams = {
  currentChat: ChatDTO;
  fetchChatData: () => void;
  fetchChatById: (id: number) => void;
  setSnackbar: (snackbar: {
    message: string;
    type: string;
    open: boolean;
  }) => void;
};

export type MessageListComponent = {
    messages: MessageDTO[];
    request: string;
    loading: boolean;
}
