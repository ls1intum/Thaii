import { ChatBody } from "../types/chatbot/chatbot.types";
import api from "./interceptor.api";

export const fetchChats = async (limit: number) => {
  try {
    if (!limit) {
      limit = 5;
    }
    const response = await api.get(`/api/v1/chats/?limit=${limit}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchChatsCount = async () => {
  try {
    const response = await api.get(`/api/v1/chats/count/`);
    return response;
  } catch (error) {
    console.error("Error fetching pages:", error);
    throw error;
  }
};

export const fetchChatById = async (chatId: number) => {
  try {
    const response = await api.get(`/api/v1/chats/${chatId}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchChatByPageId = async (pageId: number) => {
  try {
    const response = await api.get(`/api/v1/chats/page/${pageId}/`);
    return response;
  } catch (error) {
    console.error("Error fetching pages:", error);
    throw error;
  }
};

export const createChat = async (chat: ChatBody) => {
  try {
    const response = await api.post("/api/v1/chats/", chat);
    return response;
  } catch (error) {
    console.error("Error creating page:", error);
    throw error;
  }
};

export const changeChat = async (id: number, chat: ChatBody) => {
  try {
    const response = await api.put(`/api/v1/chats/${id}/`, chat);
    return response;
  } catch (error) {
    console.error("Error creating page:", error);
    throw error;
  }
};

export const deleteChat = async (id: number) => {
  try {
    const response = await api.delete(`/api/v1/chats/${id}/`);
    return response;
  } catch (error) {
    console.error("Error creating page:", error);
    throw error;
  }
};
