import axios from "axios";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.BACKEND_BASE_URL,
  timeout: 40000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Check if error is 403 (Forbidden)
    if (error.response && error.response.status === 403) {
      // Clear auth token
      setAuthToken("");

      await signOut({ redirect: false });

      toast.error("Session expired. Please sign in again.");
    }
    return Promise.reject(error);
  }
);

export default api;
