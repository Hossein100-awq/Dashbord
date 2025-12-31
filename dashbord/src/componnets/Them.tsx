// src/components/ThemeProvider.jsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  isDark: false,
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * ThemeProvider:
 * - وضعیت تم را در localStorage نگهداری و روی document.documentElement.sync می‌کند
 * - اسکریپتِ قبل از هیدریشن در layout کلاس را تنظیم کرده، اینجا فقط همگام‌سازی انجام می‌شود
 * - پیش‌فرض به dark تغییر یافت
 */
export default function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);  // پیش‌فرض dark (تغییر به true)

  // مقدار اولیه را از document.documentElement یا localStorage بگیر
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark") setIsDark(true);
      else if (stored === "light") setIsDark(false);
      else setIsDark(document.documentElement.classList.contains("dark"));
    } catch (e) {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  // هر بار که isDark تغییر کرد، کلاس و localStorage را به‌روز کن
  useEffect(() => {
    try {
      document.documentElement.classList.toggle("dark", isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (e) {}
  }, [isDark]);

  const toggle = () => setIsDark((v) => !v);

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}