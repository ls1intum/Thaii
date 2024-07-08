import { changeChat, createChat, deleteChat, fetchChatById, fetchChatByPageId, fetchChats, fetchChatsCount } from "../api/chat.api";
import { ChatBody } from "../types/chatbot/chatbot.types";

export const getChats = async (limit: number) => {
  try {
    const response = await fetchChats(limit);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getChatsCount = async () => {
  try {
    const response = await fetchChatsCount();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getChatById = async (chatId: number) => {
  try {
    const response = await fetchChatById(chatId);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getChatsByPageId = async (pageId: number) => {
  try {
    const response = await fetchChatByPageId(pageId);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const addChat = async (chat: ChatBody) => {
  try {
    const response = await createChat(chat);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const editChat = async (id: number, chat: ChatBody) => {
  try {
    const response = await changeChat(id, chat);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const removeChat = async (id: number) => {
  try {
    const response = await deleteChat(id)
    return response.data;
  } catch (error: any) {
    throw error;
  }
};





