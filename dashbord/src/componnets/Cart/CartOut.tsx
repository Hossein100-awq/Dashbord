"use client";
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import PA from "./../Feature/Pagination"; 

export interface ProductItem {
  id: number;
  name: string;
  description: string;
  isPercentage: boolean;
  isOptional: boolean;
  defaultAmount: number;
}

interface ProductListUIProps {
  productList: ProductItem[];
  totalPages: number;
  page: number;
  isLoading: boolean;
  isError: boolean;
  open: boolean;
  selectedProduct: ProductItem | null;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  onOpen: (item: ProductItem) => void;
  onClose: () => void;
}

const ProductListUI: React.FC<ProductListUIProps> = ({
  productList,
  totalPages,
  page,
  isLoading,
  isError,
  open,
  selectedProduct,
  onPageChange,
  onOpen,
  onClose,
}) => {
 
  const list = Array.isArray(productList) ? productList : [];

  return (
    <section className="w-full px-4">
      {isLoading && (
        <div className="flex justify-center p-8">
          <CircularProgress />
        </div>
      )}

      {isError && (
        <Alert severity="error" className="mb-4">
          خطا در بارگذاری لیست محصولات
        </Alert>
      )}

      {!isLoading && !isError && (
        <>
          {list.length === 0 ? (
             <div className="text-center text-gray-500 mt-8">محصولی یافت نشد</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {list.map((item: ProductItem) => (
                  <article
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-md p-4 flex flex-col w-full shadow-sm hover:shadow-md transition-shadow duration-200 border-none"
                  >
                    <div className="font-medium text-gray-900 dark:text-gray-100 text-lg">
                      {item.name}
                    </div>

                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex-grow">
                      {item.description || "بدون توضیحات"}
                    </div>

                    <div className="mt-3 flex justify-between items-center text-sm pt-2">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {item.isPercentage ? `${item.defaultAmount}%` : `${item.defaultAmount} ریال`}
                      </span>
                      {item.isOptional && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">اختیاری</span>
                      )}
                    </div>

                    <div
                      className="text-indigo-600 dark:text-indigo-400 mt-3 cursor-pointer self-end font-medium text-sm hover:underline"
                      onClick={() => onOpen(item)}
                    >
                      مشاهده جزئیات
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <PA 
                  count={totalPages} 
                  page={page} 
                  onChange={onPageChange} 
                />
              )}
            </>
          )}
        </>
      )}

      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="product-dialog-title"
        PaperProps={{
          className: "dark:bg-gray-800 dark:text-white",
          sx: { border: 'none' }
        }}
      >
        <DialogTitle id="product-dialog-title" sx={{ textAlign: "right", pb: 1 }}>
          {selectedProduct?.name || "جزئیات محصول"}
        </DialogTitle>

        <DialogContent sx={{ direction: "rtl", minHeight: "150px" }}>
          {selectedProduct ? (
            <>
              <Typography variant="body2" sx={{ mb: 2, display: 'block', lineHeight: 1.8 }}>
                {selectedProduct.description}
              </Typography>

              <div className="grid grid-cols-2 gap-4 mt-4 bg-gray-50 dark:bg-gray-700 p-3 rounded">
                 <div>
                    <Typography variant="caption" color="textSecondary">مبلغ پیش‌فرض:</Typography>
                    <Typography variant="body1">
                       {selectedProduct.isPercentage ? `${selectedProduct.defaultAmount}%` : `${selectedProduct.defaultAmount}`}
                    </Typography>
                 </div>
                 <div>
                    <Typography variant="caption" color="textSecondary">نوع محاسبه:</Typography>
                    <Typography variant="body1">
                       {selectedProduct.isPercentage ? "درصدی" : "مبلغ ثابت"}
                    </Typography>
                 </div>
                 <div>
                    <Typography variant="caption" color="textSecondary">وضعیت انتخاب:</Typography>
                    <Typography variant="body1">
                       {selectedProduct.isOptional ? "اختیاری" : "الزامی"}
                    </Typography>
                 </div>
              </div>
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

export default ProductListUI;