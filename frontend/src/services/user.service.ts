import { API_ENDPOINTS } from "../config/api.config";
import { apiClient } from "../utils/apiClient";
import type { UserProfile, ApiResponse } from "../types/user.types";

export const getMyProfile = async (): Promise<UserProfile> => {
  const data: ApiResponse<UserProfile> = await apiClient(
    `${API_ENDPOINTS.USER}/me`,
  );
  return data.data;
};

export const updateName = (name: string) => {
  return apiClient(`${API_ENDPOINTS.USER}/name`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
};

export const updateAbout = (about: string) => {
  return apiClient(`${API_ENDPOINTS.USER}/about`, {
    method: "PATCH",
    body: JSON.stringify({ about }),
  });
};

export const updateProfilePhoto = (file: File) => {
  const formData = new FormData();
  formData.append("photo", file);

  return apiClient(`${API_ENDPOINTS.USER}/photo`, {
    method: "PATCH",
    body: formData,
    headers: {}, // override JSON header
  });
};
