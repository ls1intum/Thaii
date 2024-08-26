import { createEventLog } from "../api/interaction.api";
import { EventLogBody } from "../types/interaction/interaction.types";

export const addLabel = async (event: EventLogBody) => {
    try {
      const response = await createEventLog(event);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };