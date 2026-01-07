"use client";
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import Link from "next/link";

const SideBar = () => {
  return (
    <div className="min-h-screen w-auto bg-white rounded-l-xl flex flex-col gap-6 items-center p-4">

      <h2 className="flex absolute top-0 text text-indigo-600 font-bold text-lg mt-2">
        آوا کارت
      </h2>

      <Link href="./Dashbord">
        <h2 className="mt-8 flex items-center gap-2 w-full min-w-32 px-2 py-1 hover:bg-indigo-600 rounded-md transition-all duration-200">
          <HomeIcon fontSize="small" />
          خانه
        </h2>
      </Link>

      <Link href="Profile">
        <h2 className="flex items-center gap-2 w-full min-w-32 px-2 py-1 hover:bg-indigo-600 rounded-md transition-all duration-200">
          <PersonIcon fontSize="small" />
          پروفایل
        </h2>
      </Link>

      <Link href="./CreditManagement">
        <h2 className="flex items-center gap-2 w-full min-w-32 px-2 py-1 hover:bg-indigo-600 rounded-md transition-all duration-200">
          <FeaturedPlayListIcon fontSize="small" />
          مدیریت اعتبار
        </h2>
      </Link>

     <Link href="">
      <h2 className="flex items-center gap-2 w-full min-w-32 px-2 py-1 hover:bg-indigo-600 rounded-md transition-all duration-200">
        <HowToRegIcon fontSize="small" />
        سطح دسترسی
      </h2>
     </Link>

    </div>
  );
};

export default SideBar;
