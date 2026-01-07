// src/app/layout.tsx
import { Vazirmatn } from 'next/font/google';
import "./globals.css";
import Script from "next/script";
import React from "react";
import ReactQueryProvider from '@/componnets/Feature/ReactQuery';

const vazir = Vazirmatn({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-vazir',
  display: 'swap',
});

export const metadata = {
  title: "Dashbord",
  description: "Demo - theme switch",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // مهم: vazir.variable باید دقیقاً اینجا اضافه شود
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){
            try{
              var t = localStorage.getItem('theme');
              if(t === 'dark'){ document.documentElement.classList.add('dark'); return; }
              if(t === 'light'){ document.documentElement.classList.remove('dark'); return; }
              if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.add('dark');
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
