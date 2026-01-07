"use client";
import React, { useState } from "react";
import {
  Button,
  TextField,
  Container,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// تابع لاگین را بیرون از کامپوننت تعریف می‌کنیم تا در هر رندر دوباره ساخته نشود
const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const response = await axios.post(
    "http://uat-prosha.dayatadbir.com/auth/Auth/LoginWithPassword",
    { username, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// استایل را ثابت تعریف می‌کنیم
const textFieldStyle = {
  direction: "rtl" as const,
  "& .MuiInputLabel-root": {
    right: 30,
    left: "auto",
    transformOrigin: "right top",
    "&.Mui-focused": {
      right: 30,
      left: "auto",
    },
    "&.MuiFormLabel-filled": {
      right: 30,
      left: "auto",
    },
  },
  "& .MuiOutlinedInput-root": {
    "& input": {
      textAlign: "right",
    },
  },
};

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  // اصلاح شده: استفاده از سینتکس آبجکت برای سازگاری با React Query v5
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      router.push("/Dashboard");
    },
    onError: (err: any) => {
      console.error("Login Error:", err);
      let message = "نام کاربری یا رمز عبور اشتباه است";

      if (err?.response?.data) {
        const data = err.response.data;
        if (typeof data === "string") message = data;
        else if (data.message) message = data.message;
        else if (data.error) message = data.error;
        else if (Array.isArray(data.errors)) message = data.errors.join(", ");
      } else if (err?.message) {
        message = err.message;
      }

      setError(message);
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.username || !formData.password) {
      setError("لطفاً نام کاربری و رمز عبور را وارد کنید.");
      return;
    }

    mutation.mutate({ username: formData.username, password: formData.password });
  };

  if (mutation.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Container maxWidth="sm">
        <div className="p-8 bg-white rounded-2xl shadow-xl" dir="rtl">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            ورود به حساب کاربری
          </h2>

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <TextField
              label="نام کاربری"
              fullWidth
              variant="outlined"
              autoComplete="username"
              sx={textFieldStyle}
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />

            <TextField
              label="رمز عبور"
              type="password"
              fullWidth
              variant="outlined"
              autoComplete="current-password"
              sx={textFieldStyle}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              className="mt-2"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "در حال ورود..." : "ورود"}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}