import { PageBody } from "../components/pages/types/pages.types";
import api from "./interceptor.api";

export const fetchPages = async () => {
  try {
    const response = await api.get(`/api/v1/pages/`);
    return response; 
  } catch (error) {
    throw error;
  }
};

export const fetchInsightPages = async () => {
  try {
    const response = await api.get(`/api/v1/pages/insights/`);
    return response; 
  } catch (error) {
    throw error;
  }
};

export const fetchPageById = async (pageId: number) => {
    try {
      const response = await api.get(`/api/v1/pages/${pageId}/`);
      return response; 
    } catch (error) {
      throw error;
    }
  };

export const createPage = async (page: PageBody) => {
  try {
    const response = await api.post("/api/v1/pages/", page);
    return response; 
  } catch (error) {
    throw error;
  }
};


export const changePage = async (id: number, page: PageBody) => {
  try {
    const response = await api.put(`/api/v1/pages/${id}/`, page);
    return response; 
  } catch (error) {
    throw error;
  }
};

export const deletePage = async (id: number) => {
  try {
    const response = await api.delete(`/api/v1/pages/${id}/`);
    return response; 
  } catch (error) {
    throw error;
  }
};
