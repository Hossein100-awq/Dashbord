import Navbar from "@/componnets/Feature/Navbar";
import ProfileInfo from "@/componnets/Feature/ProfileInfo";

import SideBar from "@/componnets/Feature/SideBar";
import React from "react";

const page = () => {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <SideBar />
      <div className="mx-auto w-full max-w-5xl px-4 dark:bg-black transition-colors duration-300">
        <Navbar />
        <ProfileInfo />
      </div>
      
    </div>
  );
};

export default page;
