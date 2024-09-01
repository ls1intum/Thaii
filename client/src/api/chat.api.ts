import { ChatBody } from "../types/chatbot/chatbot.types";
import api from "./interceptor.api";

// Fetch all chats for an user
// @limit: Number of loaded chats. Default number is 5.
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

// Fetch the count of all chats for an user
export const fetchChatsCount = async () => {
  try {
    const response = await api.get(`/api/v1/chats/count/`);
    return response;
  } catch (error) {
    console.error("Error fetching pages:", error);
    throw error;
  }
};

// Fetch chat by chat ID for an user
export const fetchChatById = async (chatId: number) => {
  try {
    const response = await api.get(`/api/v1/chats/${chatId}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetch chats assigned to a page for a user
// @pageId: Id of a existing page
export const fetchChatByPageId = async (pageId: number) => {
  try {
    const response = await api.get(`/api/v1/chats/page/${pageId}/`);
    return response;
  } catch (error) {
    console.error("Error fetching pages:", error);
    throw error;
  }
};

// Create new chat
// @chat: title: string, page: string, labels: string[] 
export const createChat = async (chat: ChatBody) => {
  try {
    const response = await api.post("/api/v1/chats/", chat);
    return response;
  } catch (error) {
    console.error("Error creating page:", error);
    throw error;
  }
};

// Change existing chat of user
// @chat: title: string, page: string, labels: string[] 
// @id: id of chat which should be changed
export const changeChat = async (id: number, chat: ChatBody) => {
  try {
    const response = await api.put(`/api/v1/chats/${id}/`, chat);
    return response;
  } catch (error) {
    console.error("Error creating page:", error);
    throw error;
  }
};

// Delete existing chat of user
// @id: id of chat to delete
export const deleteChat = async (id: number) => {
  try {
    const response = await api.delete(`/api/v1/chats/${id}/`);
    return response;
  } catch (error) {
    console.error("Error creating page:", error);
    throw error;
  }
};
