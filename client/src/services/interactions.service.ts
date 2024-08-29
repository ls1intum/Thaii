import { createEventLog, fetchEventLogs } from "../api/interaction.api";
import { EventLogBody } from "../types/interaction/interaction.types";

export const addEventLog = async (event: EventLogBody) => {
  try {
    const response = await createEventLog(event);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getEventLogs = async () => {
  try {
    const response = await fetchEventLogs();
    return response;
  } catch (error: any) {
    throw error;
  }
};
