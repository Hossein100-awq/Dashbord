// hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://uat-prosha.dayatadbir.com",
  headers: {
    "Content-Type": "application/json",
  },
});

interface LoginParams {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user?: {
    id: string;
    username: string;
  };
}

// اصلاح شده: آدرس را به مسیر پروکسی محلی تغییر دادیم
const login = async ({ username, password }: LoginParams): Promise<LoginResponse> => {
  const response = await axiosInstance.post("/api/login", {
    username,
    password,
  });
  return response.data;
};

export const useLogin = () => {
  return useMutation({
    // اصلاح شده: استفاده از mutationFn
    mutationFn: login,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
    },
    onError: (error: any) => {
      console.error("Login failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "خطا در ورود!");
    },
  });
};