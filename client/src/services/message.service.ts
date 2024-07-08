import { createMessage, fetchMessagesByChatId } from "../api/message.api";
import { MessageBody } from "../types/chatbot/chatbot.types";

export const getMessages = async (chatId: number) => {
  try {
    const response = await fetchMessagesByChatId(chatId);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addMessage = async (chatId: number, message: MessageBody) => {
  try {
    const response = await createMessage(chatId, message);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
