import { MessageBody } from "../types/chatbot/chatbot.types";
import api from "./interceptor.api";

// Fetches all messages associated with a specific chat by its ID
// @param chatId - The unique identifier of the chat for which messages are to be fetched
// @returns The response from the API containing the list of messages for the specified chat
export const fetchMessagesByChatId = async (chatId: number) => {
    try {
      const response = await api.get(`/api/v1/messages/${chatId}/`);
      return response; 
    } catch (error) {
      throw error;
    }
  };

// Creates a new message in a specific chat by sending a POST request with the message data
// @param chatId - The unique identifier of the chat where the message will be created
// @param message - An object of type MessageBody containing message details (e.g., content, sender)
// @returns The response from the API if the message is created successfully
export const createMessage = async (chatId: number, message: MessageBody) => {
  try {
    const response = await api.post(`/api/v1/messages/${chatId}/`, message);
    return response; 
  } catch (error) {
    throw error;
  }
};