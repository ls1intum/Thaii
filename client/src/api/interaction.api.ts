import { EventLogBody } from "../types/interaction/interaction.types";
import api from "./interceptor.api";

export const createEventLog = async (eventlog: EventLogBody) => {
    try {
      const response = await api.post("/api/v1/event-logs/", eventlog);
      return response;
    } catch (error) {
      console.error("Error creating event log:", error);
      throw error;
    }
  };