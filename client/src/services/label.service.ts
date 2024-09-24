import { createLabel, deleteLabel, fetchLabels } from "../api/label.api";
import { LabelBody } from "../types/chatbot/chatbot.types";

export const getLabels = async () => {
  try {
    const response = await fetchLabels();
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const addLabel = async (label: LabelBody) => {
  try {
    const response = await createLabel(label);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const removeLabel = async (id: number) => {
  try {
    const response = await deleteLabel(id)
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
