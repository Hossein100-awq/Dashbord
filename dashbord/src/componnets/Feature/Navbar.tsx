// src/components/Navbar.jsx
"use client";

import React from "react";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PersonIcon from "@mui/icons-material/Person";


export default function Navbar() {


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
          
            className="p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
          >
         
          </button>

          <PersonIcon fontSize="small" className="mx-2 sm:mx-3 md:mx-5" />
        </div>
      </div>
    </header>
  );
}