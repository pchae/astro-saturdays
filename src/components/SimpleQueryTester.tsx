'use client';

import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function SimpleQueryTester() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (queryClient) {
      console.log('[SimpleQueryTester] Successfully accessed QueryClient:', queryClient);
    } else {
      console.error('[SimpleQueryTester] Failed to access QueryClient.');
    }
  }, [queryClient]);

  return (
    <div>
      <p>Attempting to access QueryClient. Check console.</p>
    </div>
  );
} 