'use client';

import React from 'react';
import { QueryProvider } from './QueryProvider';
// import { SimpleQueryTester } from './SimpleQueryTester'; // Remove tester
import { SettingsTabs } from './settings/SettingsTabs'; // Use the real component

export function SettingsClientWrapper() {
  console.log('[SettingsClientWrapper] Rendering...'); // Add log
  return (
    <QueryProvider>
      {/* Render SettingsTabs inside the provider */}
      {/* <SimpleQueryTester /> */}
      <SettingsTabs />
    </QueryProvider>
  );
} 