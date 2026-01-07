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

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // استفاده از useState ساده برای مدیریت وضعیت لودینگ و خطا
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // اینجا منطق واقعی احراز هویت باید قرار بگیرد.
      // فعلاً برای جلوگیری از ارور، یک تاخیر ۱ ثانیه‌ای شبیه‌سازی می‌کنیم.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // اگر نام کاربری و رمز عبور وارد شده بود، به داشبورد برو
      if (formData.username && formData.password) {
        router.push("/Dashboard");
      } else {
        throw new Error("لطفاً نام کاربری و رمز عبور را وارد کنید.");
      }
    } catch (err: any) {
      console.error("Login Error:", err);

      let message = "نام کاربری یا رمز عبور اشتباه است";

      if (err?.data) {
        const data = err.data;
        if (typeof data === "string") {
          message = data;
        } else if (data.message) {
          message = data.message;
        } else if (data.error) {
          message = data.error;
        } else if (Array.isArray(data.errors)) {
          message = data.errors.join(", ");
        }
      } else if (err?.message) {
        message = err.message;
      }

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

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
              disabled={isLoading}
            >
              {isLoading ? "در حال ورود..." : "ورود"}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}