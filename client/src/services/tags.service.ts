import { createTag, fetchTags } from "../api/tag.api";
import { TagBody } from "../components/pages/types/pages.types";

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
