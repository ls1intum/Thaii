import { changePage, createPage, deletePage, fetchInsightPages, fetchPageById, fetchPages } from "../api/page.api";
import { PageBody } from "../components/pages/types/pages.types";

export const getPages = async () => {
  try {
    const response = await fetchPages();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPagesForInsights = async () => {
  try {
    const response = await fetchInsightPages();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPageById = async (pageId: number) => {
  try {
    const response = await fetchPageById(pageId);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addPage = async (page: PageBody) => {
  try {
    const response = await createPage(page);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const editPage = async (id: number, page: PageBody) => {
  try {
    const response = await changePage(id, page);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const removePage = async (id: number) => {
  try {
    const response = await deletePage(id)
    return response.data;
  } catch (error: any) {
    throw error;
  }
};





