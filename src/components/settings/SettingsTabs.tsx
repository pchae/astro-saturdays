import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileForm } from "./ProfileForm";
import { SecurityForm } from "./SecurityForm";
import { NotificationsForm } from "./NotificationsForm";
import type { UserSettings, ProfileFormData } from "@/types/settings";

// Define an interface for the raw profile data structure from API/script
interface RawProfileData {
  id?: string;
  userId?: string;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  companyName?: string | null;
  companyPosition?: string | null;
  // Add other fields if necessary
}

interface SettingsTabsProps {
  defaultTab?: string;
  settingsDataId: string;
}

export function SettingsTabs({ defaultTab = 'profile', settingsDataId }: SettingsTabsProps) {
  const [loadedSettings, setLoadedSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    console.log(`[SettingsTabs Client] Attempting to read data from script tag ID: ${settingsDataId}`);
    const scriptTag = document.getElementById(settingsDataId);
    if (scriptTag && scriptTag.textContent) {
      try {
        const parsedData = JSON.parse(scriptTag.textContent);
        console.log("[SettingsTabs Client] Successfully parsed raw data:", parsedData);

        // --- Transform flat profile data to nested structure --- 
        let transformedProfile: ProfileFormData | null = null;
        if (parsedData && parsedData.profile) {
          const rawProfile = parsedData.profile as RawProfileData;
          transformedProfile = {
            personal: {
              firstName: rawProfile.firstName || '',
              lastName: rawProfile.lastName || '',
              phoneNumber: rawProfile.phoneNumber || '',
            },
            professional: {
              companyName: rawProfile.companyName || '',
              companyPosition: rawProfile.companyPosition || '',
            },
          };
          console.log("[SettingsTabs Client] Transformed profile data:", transformedProfile);
        }
        // --- End Transformation --- 

        // Set state with the transformed profile data
        setLoadedSettings({
          profile: transformedProfile,
          // Keep others as they were (or null)
          security: parsedData?.security || null,
          notifications: parsedData?.notifications || null,
        });

      } catch (error) {
        console.error("[SettingsTabs Client] Failed to parse/transform JSON:", error);
        setLoadedSettings(null);
      }
    } else {
      console.warn(`[SettingsTabs Client] Script tag with ID ${settingsDataId} not found or empty.`);
      setLoadedSettings(null);
    }
  }, [settingsDataId]);

  const handleTabChange = (tab: string) => {
    window.history.replaceState(null, '', `#${tab}`);
  };

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