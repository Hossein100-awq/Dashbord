"use client";

import { ReactNode, useState } from "react"; // اضافه شدن useState
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface Props {
  children: ReactNode;
}

export default function ReactQueryProvider({ children }: Props) {
  // اصلاح شده: استفاده از useState برای جلوگیری از ساخت مجدد کلاینت
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}