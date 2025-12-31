// src/components/Navbar.jsx
"use client";

import React from "react";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PersonIcon from "@mui/icons-material/Person";
import { useTheme } from "./../Them";  // import درست

export default function Navbar() {
  const { isDark, toggle } = useTheme();

  return (
    <header className="w-full">
      <div
        className={
          "flex w-full justify-between items-center h-12 sm:h-14 md:h-16 rounded-md " +
          "bg-white text-black dark:bg-black dark:text-white my-6 sm:my-8 md:my-12 px-3 sm:px-4 transition-colors duration-300"
        }
      >
        <div className="text-sm sm:text-base md:text-lg">کاربر..</div>

        <div className="flex gap-2 items-center">
          <button
            onClick={toggle}
            aria-label={isDark ? "روشن کردن تم" : "تاریک کردن تم"}
            title={isDark ? "روشن کردن تم" : "تاریک کردن تم"}
            className="p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
          >
            {isDark ? (
              <DarkModeIcon fontSize="small" className="text-base sm:text-lg md:text-xl" />
            ) : (
              <WbSunnyIcon fontSize="small" className="text-base sm:text-lg md:text-xl" />
            )}
          </button>

          <PersonIcon fontSize="small" className="mx-2 sm:mx-3 md:mx-5" />
        </div>
      </div>
    </header>
  );
}