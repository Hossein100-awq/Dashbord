
import Navbar from "@/componnets/Feature/Navbar";  
import SideBar from "@/componnets/Feature/SideBar";  
import React from "react";
import CartOut from "@/components/../componnets/Cart/CartOut"; 
import { SecNav } from "@/componnets/Feature/TwiceNav";  
import PA from "@/componnets/Feature/Pagination";

const Page = () => {
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-gray-900 transition-colors duration-300">  {/* تم کامل: dark:bg-gray-900 برای کنتراست بهتر */}
      <SideBar />

      <div className="flex flex-1 justify-center flex-wrap">
      
        <div className="w-full max-w-5xl px-4 dark:bg-black transition-colors duration-300">  {/* تم کامل برای wrapper */}
          <Navbar />
          <SecNav />
          <CartOut />
          
          
        </div>
      <div className="rtl">
          <PA/>
      </div>
      </div>
    </div>
  );
};

export default Page;