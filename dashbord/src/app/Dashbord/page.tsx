'use client'
import Navbar from "@/componnets/Feature/Navbar";  
import SideBar from "@/componnets/Feature/SideBar";  
import React from "react";
import { SecNav } from "@/componnets/Feature/TwiceNav";  

import CartOut from "@/componnets/Hooks/News/News";
import PA from "@/componnets/Feature/Pagination";



const Page = () => {
  
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-gray-900 transition-colors duration-300">
      <SideBar />

     
      <div className="flex flex-1 flex-col overflow-hidden">
      
        <div className="flex-1 overflow-y-auto p-4">
          
        
          <div className="w-full max-w-5xl mx-auto dark:bg-black transition-colors duration-300 p-4 rounded-lg ">
            
           <div className="mb-12"> <Navbar /></div>
            <SecNav />
           
            <CartOut/>
            
            <div className="flex justify-center mt-8">
            <PA/>
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Page;