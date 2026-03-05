import api from "../axiosInstance";

export interface AuthResponse {
  token: string;
  expiresIn: number;
  user: {
    id: number;
    name: string;
    email: string;
    password: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    deletedAt: string | null;
  };
}

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post("users/login", { email, password });
  return response.data;
};

export const signupUser = async (
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> => {
  const response = await api.post("users/signup", { email, password, name });
  return response.data;
};
