export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type UserProfile = {
  _id: string; // ADD THIS
  name: string;
  phoneNumber: string;
  profilePhoto?: string;
  about: string;
};
