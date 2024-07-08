import { FilterBody } from "../types/statistics/statistics.types";
import api from "./interceptor.api";

export const fetchTotalChats = async (filter: FilterBody) => {
  try {
    const response = await api.post(`/api/v1/insights/total-chats/`, filter);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchTotalMessages = async (filter: FilterBody) => {
  try {
    const response = await api.post(`/api/v1/insights/total-messages/`, filter);
    return response;
  } catch (error) {
    throw error;
  }
};

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

export const fetchTotalEmission = async (filter: FilterBody) => {
  try {
    const response = await api.post(`/api/v1/insights/total-emission/`, filter);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchTotalWater = async (filter: FilterBody) => {
  try {
    const response = await api.post(`/api/v1/insights/total-water/`, filter);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchTotalCost = async (filter: FilterBody) => {
  try {
    const response = await api.post(`/api/v1/insights/total-cost/`, filter);
    return response;
  } catch (error) {
    throw error;
  }
};

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

export const fetchKeywords = async (filter: FilterBody) => {
  try {
    const response = await api.post(`/api/v1/insights/keywords/`, filter);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchCommonNouns = async (filter: FilterBody) => {
  try {
    const response = await api.post(`/api/v1/insights/common-nouns/`, filter);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchCommonVerbs = async (filter: FilterBody) => {
  try {
    const response = await api.post(`/api/v1/insights/common-verbs/`, filter);
    return response;
  } catch (error) {
    throw error;
  }
};

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
