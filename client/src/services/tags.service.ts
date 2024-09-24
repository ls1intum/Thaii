import { createTag, deleteTag, fetchTags } from "../api/tag.api";
import { TagBody } from "../types/page/page.types";

export const getTags = async () => {
  try {
    const response = await fetchTags();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addTag = async (tag: TagBody) => {
  try {
    const response = await createTag(tag);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const removeTag = async (id: number) => {
  try {
    const response = await deleteTag(id)
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
