import { API_ENDPOINTS } from "../config/api.config";
import { apiClient } from "../utils/apiClient";
import type {
  SignupFormData,
  LoginFormData,
  AuthResponse,
} from "../types/auth.types";

export const signupService = (formData: SignupFormData) => {
  return apiClient<AuthResponse>(`${API_ENDPOINTS.AUTH}/signup`, {
    method: "POST",
    body: JSON.stringify(formData),
  });
};

export const loginService = async (formData: LoginFormData) => {
  const data = await apiClient<AuthResponse>(`${API_ENDPOINTS.AUTH}/login`, {
    method: "POST",
    body: JSON.stringify(formData),
  });

  localStorage.setItem("isAuthenticated", "true");
  if (data.token) {
    localStorage.setItem("authToken", data.token);
  }
  return data;
};

export const logoutService = async () => {
  await apiClient(`${API_ENDPOINTS.AUTH}/logout`, {
    method: "POST",
  });

  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("authToken");
};
