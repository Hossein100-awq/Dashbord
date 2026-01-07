// src/app/layout.tsx
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import React from "react";
import ReactQueryProvider from "./../componnets/Provider";

const vazir = Vazirmatn({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata = {
  title: "Dashboard",
  description: "Demo - theme switch",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){
            try{
              var t = localStorage.getItem('theme');
              if(t === 'dark'){ document.documentElement.classList.add('dark'); return; }
              if(t === 'light'){ document.documentElement.classList.remove('dark'); return; }
              // اصلاح شده: اگر تم ذخیره نشده، از تنظیمات سیستم استفاده کن
              if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            }catch(e){}
          })();`}
        </Script>
      </head>
      <body>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}