"use client";

import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ClearIcon from "@mui/icons-material/Clear"; 
import Link from "next/link";

type SerchBarProps = {
  onOpenAdd: () => void;
  onSearch: (query: string) => void;
};

export const SerchBar: React.FC<SerchBarProps> = ({ onOpenAdd, onSearch }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceRef = useRef<number | null>(null);


  useEffect(() => {
    if (isSearchFocused) {
      const timer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 100); 
      return () => clearTimeout(timer);
    }
  }, [isSearchFocused]);

  useEffect(() => {
    if (!isSearchFocused) {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      setValue("");
      onSearch("");
    }
  }, [isSearchFocused, onSearch]);


  useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  const handleToggle = () => {
    setIsSearchFocused((prev) => !prev);
  };

  const handleChange = (v: string) => {
    setValue(v);

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      onSearch(v);
      debounceRef.current = null;
    }, 300);
  };

  const handleClear = () => {
    setValue("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <header className="w-full">
      <div className="flex w-full justify-between items-center h-16 rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] my-6 px-4 sm:px-8">
        
   
        <div className="flex items-center gap-3 min-w-max">
          <div className="p-2 bg-blue-50/50 rounded-lg text-blue-600">
            <SearchIcon />
          </div>
          <p className="font-bold text-gray-700 text-lg tracking-tight hidden sm:block">
            انواع هزینه‌ها
          </p>
        </div>

       
        <div className="flex items-center gap-3 sm:gap-4">
          
     
          <div
            className={`
              relative flex items-center justify-end bg-white border
              rounded-full overflow-hidden cursor-pointer
              transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] // انیمیشن نرم و کشسانی
              group
              ${isSearchFocused 
                ? "w-64 sm:w-80 border-blue-200 shadow-[0_4px_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-50" 
                : "w-12 border-gray-200 hover:border-blue-200 hover:shadow-md"}
            `}
            onClick={!isSearchFocused ? handleToggle : undefined}
          >
   
            <span className={`
              absolute right-3.5 text-gray-400 z-10 transition-colors duration-300
              ${isSearchFocused ? 'text-blue-500' : 'group-hover:text-blue-500'}
            `}>
              <SearchIcon fontSize="small" />
            </span>

  
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={(e) => {
                
                 if (!value && !e.relatedTarget?.closest("button")) {
                   setIsSearchFocused(false);
                 }
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsSearchFocused(false);
                }
              }}
              placeholder="جستجو عنوان..."
              className={`
                w-full bg-transparent border-none outline-none text-gray-700 text-sm
                transition-all duration-300 ease-in-out
                ${isSearchFocused 
                  ? "opacity-100 pr-10 pl-9 py-2.5 delay-75 w-auto" // وقتی باز شد با کمی تاخیر ظاهر شود
                  : "opacity-0 w-0 p-0 pointer-events-none"} // وقتی بسته است کاملاً مخفی باشد
              `}
            />


            <div className={`
              absolute left-2 z-10 transition-all duration-300 origin-left
              ${isSearchFocused && value ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"}
            `}>
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
              >
                <ClearIcon fontSize="small" />
              </button>
            </div>
          </div>



          <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

 
          <Button 
            onClick={() => onOpenAdd()} 
            className="flex gap-1 font-normal text-sm" 
            variant="outlined"
            sx={{ 
              borderRadius: 2, 
              borderColor: '#E5E7EB', 
              color: '#4B5563',
              '&:hover': { borderColor: '#3B82F6', color: '#3B82F6' } 
            }}
          >
            <AddCircleIcon fontSize="small" />
            <span className="hidden sm:inline">افزودن</span>
          </Button>


          <Link href="./Dashbord">
            <Button 
              className="flex gap-1 font-normal text-sm text-gray-500 hover:bg-gray-50" 
              sx={{ minWidth: 'auto', borderRadius: 2 }}
            >
              <NavigateNextIcon fontSize="small" style={{ transform: 'rotate(180deg)' }} />
              <span className="hidden sm:inline">بازگشت</span>
            </Button>
          </Link>

        </div>
      </div>
    </header>
  );
};

export default SerchBar;