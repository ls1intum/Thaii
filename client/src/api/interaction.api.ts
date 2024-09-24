import { EventLogBody } from "../types/interaction/interaction.types";
import api from "./interceptor.api";

// Creates a new event log by sending a POST request with the event log data
// @param eventlog - An object of type EventLogBody containing event log details
// @returns The response from the API if the event log is created successfully
export const createEventLog = async (eventlog: EventLogBody) => {
  try {
    const response = await api.post("/api/v1/event-logs/", eventlog);
    return response;
  } catch (error) {
    console.error("Error creating event log:", error);
    throw error;
  }
};

// Fetches all event logs from the API as a blob (binary large object)
// @returns The response from the API containing the event logs in binary format
export const fetchEventLogs = async () => {
  try {
    const response = await api.get(`/api/v1/event-logs/`, {
      responseType: "blob",
    });
    return response;
  } catch (error) {
    throw error;
  }
};
