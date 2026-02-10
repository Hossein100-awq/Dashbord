import Navbar from "@/componnets/Feature/Navbar";
import ProfileInfo from "@/componnets/Feature/ProfileInfo";
import SideBar from "@/componnets/Feature/SideBar";
import React from "react";

const Page = () => {
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-gray-900 transition-colors duration-300">
      <SideBar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-2 dark:bg-black transition-colors duration-300 min-h-screen">
            <Navbar />
            <ProfileInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;