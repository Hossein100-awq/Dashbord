
"use client";
import Image from "next/image";
import React from "react";

export const SecNav = () => {
  return (
    <div className=" w-full relative"> 
      <div className="relative my-6 sm:my-8 md:my-10">
        <div
          className="h-28relative bg-white rounded-md shadow-md overflow-visible px-4 py-3 sm:py-4 md:py-5"
          dir="rtl"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-3">
            <div className="w-full sm:w-auto text-center sm:text-right text-sm sm:text-base md:text-lg lg:text-xl">
              به پنل آوید کارت خوش آمدید
            </div>

            <div className="relative flex justify-center sm:justify-end w-full sm:w-auto -mt-6 sm:-mt-10 md:-mt-12">
              <div className="absolute left-8 -translate-x-1/2 -top-10 sm:-top-12 md:-top-16 pointer-events-none z-10">
                <div className="bg-white w-10 h-2 sm:w-14 sm:h-3 md:w-20 md:h-4 lg:w-24 lg:h-5 rounded-t-full" />
              </div>

              <div className="relative">
                <Image src='/icon-6931514_1280.png'
                alt="image"
                width={55}
                height={50}

                
                />
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
