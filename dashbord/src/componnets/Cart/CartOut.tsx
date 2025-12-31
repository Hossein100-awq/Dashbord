
"use client";
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import cartInside from "./CartInside"; 

const Cart = () => {
  const cartData = [
    { id: 1, title: "استخدام حساب‌دار تمام‌وقت", company: "شرکت آب و فاضلاب بابل" },
    { id: 2, title: "استخدام دستیار حساب‌داری (پاره‌وقت)", company: "شرکت آب و فاضلاب بابل" },
    { id: 3, title: "استخدام حساب‌دار ارشد / گزارشگری مالی", company: "شرکت آب و فاضلاب بابل" },
    { id: 4, title: "استخدام کارآموز حسابداری / حساب‌دار جوان", company: "شرکت آب و فاضلاب بابل" },
  ];

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpen = (itemId) => {
    const item = cartData.find((c) => c.id === itemId);
    const found = cartInside.find((t) => t.id === itemId);
    setSelectedItem({
      id: item.id,
      title: item.title,
      company: item.company,
      text: found ? found.text : "متن موجود نیست.",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelectedItem(null), 200);
  };

  return (
    <section className="w-full"> 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {cartData.map((item) => (
          <article key={item.id} className="bg-white rounded-md p-4 flex flex-col w-full">
            <div className="font-medium">{item.title}</div>

            <hr className="mt-2 border-t border-gray-300 w-10/12 mx-auto" />

            <div className="mt-2 text-sm text-gray-600">{item.company}</div>

            <div
              dir="ltr"
              className="text-indigo-700 mt-auto cursor-pointer self-end"
              onClick={() => handleOpen(item.id)}
            >
              ادامه مطلب
            </div>
          </article>
        ))}
      </div>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="job-dialog-title" aria-describedby="job-dialog-description">
        <DialogTitle id="job-dialog-title" sx={{ textAlign: "right" }}>
          {selectedItem?.title}
        </DialogTitle>

        <DialogContent dividers sx={{ direction: "rtl" }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            شرکت: {selectedItem?.company}
          </Typography>

          <Typography id="job-dialog-description" variant="body2" sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>
            {selectedItem?.text}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 2 }}>
          <Button onClick={handleClose}>بستن</Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default Cart;
