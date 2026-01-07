"use client";
import React, { useState } from "react";
// ایمپورت کامپوننت‌های مورد نیاز MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// ایمپورت هوک‌های API
// لطفا مسیر ایمپورت را با ساختار پوشه خودتان چک کنید
import { useJobDetail } from "../../componnets/ProfileApi/JobDetail"; 
import { useJobList } from "../../componnets/ProfileApi/Joblist"; 

const Cart = () => {
  // ۱. دریافت لیست از API
  const { data: jobList, isLoading: isListLoading, isError: isListError } = useJobList();

  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // ۲. دریافت جزئیات با کلیک
  const { data: detailData, isLoading: isDetailLoading, isError: isDetailError } = useJobDetail(selectedItemId);

  const handleOpen = (itemId: number) => {
    setSelectedItemId(itemId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // اصلاح شد: فاصله بین Item و Id برداشته شد
    setTimeout(() => setSelectedItemId(null), 300);
  };

  // استخراج جزئیات از ساختار پیچیده API
  const jobDetail = detailData?.value || detailData?.valueOrDefault;

  // ۳. مدیریت وضعیت بارگذاری لیست
  if (isListLoading) return <div className="p-4 text-center">در حال دریافت لیست آگهی‌ها...</div>;
  if (isListError) return <div className="p-4 text-center text-red-500">خطا در دریافت لیست</div>;

  return (
    <section className="w-full px-4">
      {/* ۴. نقشه برداری روی داده‌های API */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {jobList?.map((item) => (
          <article 
            key={item.id} 
            className="bg-white dark:bg-gray-800 rounded-md p-4 flex flex-col w-full shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
          >
            <div className="font-medium text-gray-900 dark:text-gray-100">{item.title}</div>
            
            <hr className="mt-2 border-t border-gray-300 dark:border-gray-600 w-10/12 mx-auto" />
            
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {item.company || "شرکت نامشخص"}
            </div>
            
            <div
              className="text-indigo-600 dark:text-indigo-400 mt-auto cursor-pointer self-end font-medium text-sm hover:underline"
              onClick={() => handleOpen(item.id)}
            >
              ادامه مطلب
            </div>
          </article>
        ))}
      </div>

      {/* مودال نمایش جزئیات */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="sm" 
        aria-labelledby="job-dialog-title"
        PaperProps={{
          className: "dark:bg-gray-800 dark:text-white"
        }}
      >
        <DialogTitle id="job-dialog-title" sx={{ textAlign: "right", pb: 1 }}>
          {isDetailLoading ? "در حال بارگذاری..." : (jobDetail?.title || "عنوان آگهی")}
        </DialogTitle>

        <DialogContent dividers sx={{ direction: "rtl", minHeight: "150px" }}>
          {isDetailLoading ? (
            <div className="flex justify-center items-center h-40">
              <CircularProgress />
            </div>
          ) : isDetailError ? (
            <Alert severity="error" className="rtl">
              خطا در دریافت اطلاعات. لطفاً دوباره تلاش کنید.
            </Alert>
          ) : (
            <>
              {/* نمایش خلاصه اگر وجود داشته باشد */}
              {jobDetail?.summary && (
                <Typography variant="caption" sx={{ mb: 2, display: 'block', color: 'text.secondary' }}>
                  {jobDetail.summary}
                </Typography>
              )}

              {/* نمایش متن اصلی */}
              <Typography 
                variant="body2" 
                sx={{ 
                  whiteSpace: "pre-line", 
                  lineHeight: 1.8,
                  fontFamily: "inherit" 
                }}
              >
                {jobDetail?.text || "متن‌ی برای این آگهی موجود نیست."}
              </Typography>
              
              {/* نمایش تاریخ ثبت */}
              {jobDetail?.recordDateFa && (
                <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.disabled' }}>
                  تاریخ ثبت: {jobDetail.recordDateFa}
                </Typography>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={handleClose} variant="contained" size="small">
            بستن
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default Cart;