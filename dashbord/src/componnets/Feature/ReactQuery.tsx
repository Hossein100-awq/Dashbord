// src/providers/ReactQueryProvider.jsx
"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
export default function ReactQueryProvider({ children }) {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 1000 * 60 * 2, 
      },
      mutations: {
        retry: false,
      },
    },
  }));

  return <QueryClientProvider client={queryClient}>{children}
  <ReactQueryDevtools initialIsOpen={false}/>
  
  </QueryClientProvider>;
}
