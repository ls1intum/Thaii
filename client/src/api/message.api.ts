import { MessageBody } from "../types/chatbot/chatbot.types";
import api from "./interceptor.api";

export const fetchMessagesByChatId = async (chatId: number) => {
    try {
      const response = await api.get(`/api/v1/messages/${chatId}/`);
      return response; 
    } catch (error) {
      throw error;
    }
  };

export const createMessage = async (chatId: number, message: MessageBody) => {
  try {
    const response = await api.post(`/api/v1/messages/${chatId}/`, message);
    return response; 
  } catch (error) {
    throw error;
  }
};