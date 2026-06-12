import { API_ENDPOINTS } from "../config/api.config";
import { apiClient } from "../utils/apiClient";

export const sendMessageAPI = (chatId: string, content: string) => {
  return apiClient(`${API_ENDPOINTS.MESSAGE}`, {
    method: "POST",
    body: JSON.stringify({ chatId, content }),
  });
};

export const getMessages = (chatId: string) => {
  return apiClient(`${API_ENDPOINTS.MESSAGE}/${chatId}`);
};
