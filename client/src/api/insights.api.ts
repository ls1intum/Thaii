import { FilterBody } from "../types/statistics/statistics.types";
import api from "./interceptor.api";

//@filter:
// - dateRange: Dates included in analysis
// - page: Pages included in analysis
// - labels: Labels included in analysis
// - tags: Tags included in analysis

// Fetches the total number of chats based on the provided filter criteria
export const fetchTotalChats = async (filter: FilterBody) => {
  try {
    const response = await api.post(`/api/v1/insights/total-chats/`, filter);
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetches the total number of messages based on the provided filter criteria
export const fetchTotalMessages = async (filter: FilterBody) => {
  try {
    const response = await api.post(`/api/v1/insights/total-messages/`, filter);
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetches chats and messages statistics by a specific time unit
export const fetchChatsMessagesByTime = async (
  filter: FilterBody,
  item: number
) => {
  try {
    const response = await api.post(
      `/api/v1/insights/messages-chats-by-time/${item}/`,
      filter
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetches chats and messages statistics by a specific item
export const fetchChatsMessagesByItem = async (
  filter: FilterBody,
  item: number
) => {
  try {
    const response = await api.post(
      `/api/v1/insights/messages-chats-by-item/${item}/`,
      filter
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetches the duration of conversations based on the provided filter criteria
export const fetchConversationDuration = async (filter: FilterBody) => {
  try {
    const response = await api.post(
      `/api/v1/insights/conversation-duration/`,
      filter
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetches conversation duration by specific items
export const fetchConversationDurationByItem = async (
  filter: FilterBody,
  item: number
) => {
  try {
    const response = await api.post(
      `/api/v1/insights/conversation-duration-by-item/${item}/`,
      filter
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetches the total emission statistics based on the filter criteria
export const fetchTotalEmission = async (filter: FilterBody) => {
  try {
    const response = await api.post(`/api/v1/insights/total-emission/`, filter);
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetches total water usage statistics based on the filter criteria
export const fetchTotalWater = async (filter: FilterBody) => {
  try {
    const response = await api.post(`/api/v1/insights/total-water/`, filter);
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetches the total cost statistics based on the filter criteria
export const fetchTotalCost = async (filter: FilterBody) => {
  try {
    const response = await api.post(`/api/v1/insights/total-cost/`, filter);
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetches tradeoff indicators by a time unit
export const fetchTradeoffIndicatorsByTime = async (
  filter: FilterBody,
  item: number
) => {
  try {
    const response = await api.post(
      `/api/v1/insights/tradeoff-by-time/${item}/`,
      filter
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetches tradeoff indicators by a specific item
export const fetchTradeoffIndicatorsByItem = async (
  filter: FilterBody,
  item: number
) => {
  try {
    const response = await api.post(
      `/api/v1/insights/tradeoff-by-item/${item}/`,
      filter
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetches keywords based on the provided filter criteria
export const fetchKeywords = async (filter: FilterBody) => {
  try {
    const response = await api.post(`/api/v1/insights/keywords/`, filter);
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetches common nouns from the API based on the filter criteria
export const fetchCommonNouns = async (filter: FilterBody) => {
  try {
    const response = await api.post(`/api/v1/insights/common-nouns/`, filter);
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetches common verbs from the API based on the filter criteria
export const fetchCommonVerbs = async (filter: FilterBody) => {
  try {
    const response = await api.post(`/api/v1/insights/common-verbs/`, filter);
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetches common adjectives from the API based on the filter criteria
export const fetchCommonAdjectives = async (filter: FilterBody) => {
  try {
    const response = await api.post(
      `/api/v1/insights/common-adjectives/`,
      filter
    );
    return response;
  } catch (error) {
    throw error;
  }
};
