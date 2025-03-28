'use client'; // Mark as a client component

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Optional: If you want React Query DevTools
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create client instance once per component instance
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Configure default query options (e.g., staleTime)
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
        refetchOnWindowFocus: false, // Adjust as needed
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Optional: React Query DevTools */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
} 