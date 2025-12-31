// src/app/page.jsx  // فرض بر src/app/page.tsx اگر page.jsx است
import Navbar from "@/componnets/US/Navbar";  // import درست (فرض بر مسیر components)
import SideBar from "@/components/../componnets/US/SideBar";  // import درست
import React from "react";
import CartOut from "@/components/../componnets/Cart/CartOut";  // import درست
import { SecNav } from "@/components/../componnets/US/SecNav";  // import درست

const Page = () => {
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-gray-900 transition-colors duration-300">  {/* تم کامل: dark:bg-gray-900 برای کنتراست بهتر */}
      <SideBar />

      <div className="flex flex-1 justify-center">
        {/* wrapper والدِ عرض ثابت و ریسپانسیو */}
        <div className="w-full max-w-5xl px-4 dark:bg-black transition-colors duration-300">  {/* تم کامل برای wrapper */}
          <Navbar />
          <SecNav />
          <CartOut />
        </div>
      </div>
    </div>
  );
};

export default Page;