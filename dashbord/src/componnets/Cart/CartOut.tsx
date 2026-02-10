"use client";
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { NewsItem } from "./../../componnets/Hooks/News/News";

interface NewsListUIProps {
  newsList: NewsItem[];
  isLoading: boolean;
  isError: boolean;
  open: boolean;
  selectedNews: NewsItem | null;
  onOpen: (item: NewsItem) => void;
  onClose: () => void;
}

const NewsList: React.FC<NewsListUIProps> = ({
  newsList,
  isLoading,
  isError,
  open,
  selectedNews,
  onOpen,
  onClose,
}) => {
 
  const list = Array.isArray(newsList) ? newsList : [];

  const cleanHtml = (html: string) => {
    if (!html) return "";
    let cleaned = html.replace(/href="javascript:.*?"/gi, 'href="#" onClick="return false;"');
    cleaned = cleaned.replace(/onclick=".*?"/gi, '');
    return cleaned;
  };

  return (
    <section className="w-full">
      {isLoading && (
        <div className="flex justify-center p-8">
          <CircularProgress />
        </div>
      )}

      {isError && (
        <Alert severity="error" className="mb-4">
          خطا در بارگذاری لیست اخبار
        </Alert>
      )}

      {!isLoading && !isError && (
        <>
          {list.length === 0 ? (
             <div className="text-center text-gray-500 mt-8">خبری یافت نشد</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {list.map((item: NewsItem) => (
                  <article
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-md overflow-hidden flex flex-col w-full shadow-sm hover:shadow-md transition-shadow duration-200 border-none"
                  >
                    {item.picture && (
                      <div className="w-full h-48 bg-gray-200">
                        <img src={item.picture} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="font-medium text-gray-900 dark:text-gray-100 text-lg leading-6 mb-2">
                        {item.title}
                      </div>

                      <div className="text-sm text-gray-600 dark:text-gray-400 flex-grow line-clamp-3">
                        {item.summary || "بدون توضیحات"}
                      </div>

                      <div className="mt-4 flex justify-between items-center text-xs text-gray-500 border-t dark:border-gray-700 pt-2">
                        <span>{item.recordDateFa}</span>
                        <span>{item.recordTime}</span>
                      </div>

                      <div
                        className="text-indigo-600 dark:text-indigo-400 mt-3 cursor-pointer self-end font-medium text-sm hover:underline"
                        onClick={() => onOpen(item)}
                      >
                        مشاهده جزئیات
                      </div>
                    </div>
                  </article>
                ))}
              </div>
          )}
        </>
      )}

      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="news-dialog-title"
        PaperProps={{
          className: "dark:bg-gray-800 dark:text-white",
          sx: { border: 'none' }
        }}
      >
        <DialogTitle id="news-dialog-title" sx={{ textAlign: "right", pb: 1 }}>
          {selectedNews?.title || "جزئیات خبر"}
        </DialogTitle>

        <DialogContent sx={{ direction: "rtl" }}>
          {selectedNews ? (
            <>
              {selectedNews.picture && (
                <img src={selectedNews.picture} alt={selectedNews.title} className="w-full h-64 object-cover rounded-md mb-4" />
              )}
              <div className="flex gap-4 mb-4 text-sm text-gray-500 border-b border-gray-200 pb-2">
                <span>{selectedNews.recordDateFa}</span>
                <span>|</span>
                <span>{selectedNews.recordTime}</span>
              </div>
              
              <div 
                className="news-content text-justify leading-7"
                dangerouslySetInnerHTML={{ 
                  __html: cleanHtml(selectedNews.text || selectedNews.summary) 
                }}
              />

              <style jsx global>{`
                .news-content table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 15px 0;
                  font-size: 14px;
                  border: 1px solid #ccc;
                }
                .news-content td {
                  border: 1px solid #ccc;
                  padding: 8px;
                  min-width: 50px;
                  vertical-align: top;
                }
                .news-content p {
                  margin-bottom: 12px;
                  line-height: 1.8;
                }
                .news-content img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 4px;
                  margin: 10px 0;
                }
                .news-content span {
                  font-weight: inherit;
                  color: inherit;
                }
              `}</style>
            </>
          ) : (
            <div className="flex justify-center items-center h-40">
              <CircularProgress />
            </div>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={onClose} variant="contained" size="small">
            بستن
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default NewsList;