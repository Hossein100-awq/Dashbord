import { Vazirmatn } from "next/font/google";
import "./globals.css";
import React from "react";
import ReactQueryProvider from "./../componnets/Provider";
import AuthGuard from "@/componnets/AuthGuard";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body>
        <ReactQueryProvider>
          <AuthGuard>{children}</AuthGuard>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
