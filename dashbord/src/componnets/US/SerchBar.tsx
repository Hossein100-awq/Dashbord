
"use client";

import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Link from "next/link";

type SerchBarProps = {
  onOpenAdd: () => void;
  onSearch: (query: string) => void;
};

export const SerchBar: React.FC<SerchBarProps> = ({ onOpenAdd, onSearch }) => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (showSearchInput) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
    return;
  }, [showSearchInput]);

  useEffect(() => {
    if (!showSearchInput) {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      setValue("");
      const t = window.setTimeout(() => onSearch(""), 0);
      return () => clearTimeout(t);
    }
    return;
  }, [showSearchInput, onSearch]);


  useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  const handleToggle = () => {
    setShowSearchInput((s) => !s);
  };

  const handleChange = (v: string) => {
    setValue(v);

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      onSearch(v);
      debounceRef.current = null;
    }, 300);
  };

  return (
    <header className="w-full">
      <div className="flex w-full justify-between items-center h-12 sm:h-14 md:h-16 rounded-md bg-white my-6 sm:my-8 md:my-12 px-3 sm:px-4">
        <div>
          <p className="flex gap-2 items-center">
            <SearchIcon /> انواع هزینه ها
          </p>
        </div>

        <div className="relative flex items-center gap-2">
          <Button className="flex gap-1" variant="outlined" onClick={handleToggle}>
            جستجو
          </Button>

          <Button onClick={() => onOpenAdd()} className="flex gap-1" variant="outlined">
            <AddCircleIcon />
            افزودن
          </Button>

          <Link href="./Dashbord">
            <Button className="flex gap-1" variant="outlined">
              <NavigateNextIcon />
              بازگشت
            </Button>
          </Link>

          
          <div
            className={`absolute right-0 top-full mt-1 z-50 overflow-hidden transition-all duration-200 ${
              showSearchInput ? "w-48 opacity-100" : "w-0 opacity-0"
            }`}
          >
            <input
              ref={inputRef}
              id="global-search-input"
              type="text"
              value={value}
              placeholder="جستجو... (عنوان یا مبلغ)"
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setShowSearchInput(false);
                }
                if (e.key === "Enter") {
                  if (debounceRef.current) window.clearTimeout(debounceRef.current);
                  onSearch(value);
                }
              }}
              className="w-full text-sm py-1 px-2 border rounded shadow-sm bg-white"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default SerchBar;