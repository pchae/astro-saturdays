import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileForm } from "./ProfileForm";
import { SecurityForm } from "./SecurityForm";
import { NotificationsForm } from "./NotificationsForm";
import type { UserSettings, ProfileFormData } from "@/types/settings";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

interface RawApiSettings {
  profile: {
    id?: string;
    userId?: string;
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    companyName?: string | null;
    companyPosition?: string | null;
  } | null;
  security: any;
  notifications: any;
}

interface SettingsTabsProps {
  defaultTab?: string;
}

const fetchSettings = async (): Promise<RawApiSettings> => {
  console.log('[fetchSettings] Fetching from /api/settings/all...');
  const response = await fetch('/api/settings/all');
  if (!response.ok) {
    let errorBody = 'Unknown error';
    try {
      const errorJson = await response.json();
      errorBody = errorJson.error || JSON.stringify(errorJson);
    } catch { /* Ignore */ }
    console.error(`[fetchSettings] API fetch failed with status ${response.status}: ${errorBody}`);
    throw new Error(`Failed to fetch settings. Status: ${response.status}. Error: ${errorBody}`);
  }
  const data = await response.json();
  console.log('[fetchSettings] Successfully fetched settings:', data);
  return data as RawApiSettings;
};

export function SettingsTabs({ defaultTab = 'profile' }: SettingsTabsProps) {
  const { 
    data: loadedSettings,
    isLoading,
    isError,
    error 
  } = useQuery<RawApiSettings, Error, UserSettings | null>({
    queryKey: ['settings', 'all'],
    queryFn: fetchSettings,
    staleTime: 1000 * 60 * 5,
    select: (rawData) => {
      if (!rawData) return null;
      console.log('[useQuery select] Transforming raw API data:', rawData);
      let transformedProfile: ProfileFormData | null = null;
      if (rawData.profile) {
        transformedProfile = {
          personal: {
            firstName: rawData.profile.firstName || '',
            lastName: rawData.profile.lastName || '',
            phoneNumber: rawData.profile.phoneNumber || '',
          },
          professional: {
            companyName: rawData.profile.companyName || '',
            companyPosition: rawData.profile.companyPosition || '',
          },
        };
      }
      const transformedData: UserSettings = {
        profile: transformedProfile,
        security: rawData.security || null,
        notifications: rawData.notifications || null,
      };
      console.log('[useQuery select] Returning transformed data:', transformedData);
      return transformedData;
    },
  });

  const handleTabChange = (tab: string) => {
    window.history.replaceState(null, '', `#${tab}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error Loading Settings</AlertTitle>
        <AlertDescription>
          There was a problem fetching your settings. Please try refreshing the page. 
          {error && <p className="mt-2 text-xs">Details: {error.message}</p>}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid max-w-7xl grid-cols-4">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="profile">
          <ProfileForm initialData={loadedSettings?.profile ?? undefined} />
        </TabsContent>
        
        <TabsContent value="security">
          <SecurityForm initialData={loadedSettings?.security ?? undefined} />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationsForm initialData={loadedSettings?.notifications ?? undefined} />
        </TabsContent>
      </div>
    </Tabs>
  );
} 