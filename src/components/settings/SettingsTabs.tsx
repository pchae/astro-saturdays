import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileForm } from "./ProfileForm";
import { SecurityForm } from "./SecurityForm";
import { NotificationsForm } from "./NotificationsForm";

interface SettingsTabsProps {
  defaultTab?: string;
}

export function SettingsTabs({ defaultTab = 'profile' }: SettingsTabsProps) {
  const handleTabChange = (tab: string) => {
    // Update URL hash without triggering a navigation
    window.history.replaceState(null, '', `#${tab}`);
  };

  return (
    <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>
        
        <TabsContent value="security">
          <SecurityForm />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationsForm />
        </TabsContent>
      </div>
    </Tabs>
  );
} 