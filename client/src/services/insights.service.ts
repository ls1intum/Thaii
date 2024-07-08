import {
  fetchChatsMessagesByItem,
  fetchChatsMessagesByTime,
  fetchCommonAdjectives,
  fetchCommonNouns,
  fetchCommonVerbs,
  fetchConversationDuration,
  fetchConversationDurationByItem,
  fetchKeywords,
  fetchTotalChats,
  fetchTotalCost,
  fetchTotalEmission,
  fetchTotalMessages,
  fetchTotalWater,
  fetchTradeoffIndicatorsByItem,
  fetchTradeoffIndicatorsByTime,
} from "../api/insights.api";
import { FilterBody } from "../types/statistics/statistics.types";

export const getTotalChats = async (filter: FilterBody) => {
  try {
    const response = await fetchTotalChats(filter);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTotalMessages = async (filter: FilterBody) => {
  try {
    const response = await fetchTotalMessages(filter);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getChatsMessagesByTime = async (
  filter: FilterBody,
  item: number
) => {
  try {
    const response = await fetchChatsMessagesByTime(filter, item);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getChatsMessagesByItem = async (
  filter: FilterBody,
  item: number
) => {
  try {
    const response = await fetchChatsMessagesByItem(filter, item);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAvgChatDuration = async (filter: FilterBody) => {
  try {
    const response = await fetchConversationDuration(filter);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAvgChatDurationByItem = async (
  filter: FilterBody,
  item: number
) => {
  try {
    const response = await fetchConversationDurationByItem(filter, item);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTotalEmission = async (filter: FilterBody) => {
  try {
    const response = await fetchTotalEmission(filter);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTotalWaterWaste = async (filter: FilterBody) => {
  try {
    const response = await fetchTotalWater(filter);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTotalCost = async (filter: FilterBody) => {
  try {
    const response = await fetchTotalCost(filter);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTradeoffIndicatorsByTime = async (
  filter: FilterBody,
  item: number
) => {
  try {
    const response = await fetchTradeoffIndicatorsByTime(filter, item);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTradeoffIndicatorsByItem = async (
  filter: FilterBody,
  item: number
) => {
  try {
    const response = await fetchTradeoffIndicatorsByItem(filter, item);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getKeywords = async (filter: FilterBody) => {
  try {
    const response = await fetchKeywords(filter);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCommonNouns = async (filter: FilterBody) => {
  try {
    const response = await fetchCommonNouns(filter);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCommonVerbs = async (filter: FilterBody) => {
  try {
    const response = await fetchCommonVerbs(filter);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCommonAdjectives = async (filter: FilterBody) => {
  try {
    const response = await fetchCommonAdjectives(filter);
    return response.data;
  } catch (error) {
    throw error;
  }
};
