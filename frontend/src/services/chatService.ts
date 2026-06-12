import { API_ENDPOINTS } from "../config/api.config";
import { apiClient } from "../utils/apiClient";

export const getUserChats = () => {
  return apiClient<{ success: boolean; data: any[] }>(
    `${API_ENDPOINTS.CHAT}/getChats`,
  );
};

export const createChat = (phoneNumber: string) => {
  return apiClient<{ success: boolean; data: any }>(
    `${API_ENDPOINTS.CHAT}/createChat`,
    {
      method: "POST",
      body: JSON.stringify({ phoneNumber }),
    },
  );
};
