export interface SignupFormData {
  name: string;
  phoneNumber: string;
  password: string;
}

export interface LoginFormData {
  phoneNumber: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user: {
    _id: string;
    name: string;
    phoneNumber: string;
  };
}
