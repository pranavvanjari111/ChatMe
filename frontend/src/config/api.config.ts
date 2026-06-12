const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  AUTH: `${BASE_URL}/auth`,
  CHAT: `${BASE_URL}/chat`,
  MESSAGE: `${BASE_URL}/message`,
  USER: `${BASE_URL}/user`,
};
