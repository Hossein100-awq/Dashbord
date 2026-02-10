'use client'
import Navbar from "@/componnets/Feature/Navbar";
import SideBar from "@/componnets/Feature/SideBar";
import React, { useState } from "react";
import { SecNav } from "@/componnets/Feature/TwiceNav";

import NewsList from "./../../componnets/Cart/CartOut";
import { useNews, NewsItem } from "./../../componnets/Hooks/News/News";
import PA from "@/componnets/Feature/Pagination";

const Page = () => {
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const [open, setOpen] = useState<boolean>(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);


  const { data, loading, error, total } = useNews({
    _page: page,
    _limit: limit,
    _sort: 'id',
    _order: 'desc'
  });

  const totalPages = Math.ceil((total || 0) / limit);

  const handleOpen = (item: NewsItem) => {
    setSelectedNews(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedNews(null);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    const container = document.getElementById('main-scroll-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-gray-900 transition-colors duration-300">
      <SideBar />

      <div className="flex flex-1 flex-col overflow-hidden relative">
        
        <div id="main-scroll-container" className="flex-1 overflow-y-auto">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-2 dark:bg-black transition-colors duration-300 min-h-full">
             
             <div className="mb-4"> <Navbar /></div>
             <SecNav />
             
             <div className="w-full pb-8">
                <NewsList
                    newsList={data}
                    isLoading={loading}
                    isError={!!error}
                    open={open}
                    selectedNews={selectedNews}
                    onOpen={handleOpen}
                    onClose={handleClose}
                />
             </div>

          </div>
        </div>

        {totalPages > 0 && (
          <div>
             <div className="w-full max-w-[1600px] mx-auto flex justify-center">
                <PA count={totalPages} page={page} onChange={handlePageChange} />
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Page;