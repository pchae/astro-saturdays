import { SettingsForm } from "@/components/settings/SettingsForm"
import { getUserProfile } from "@/lib/api/user"

export const metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences.",
}

export default async function SettingsPage() {
  const profile = await getUserProfile();

  return (
    <div className="container max-w-screen-lg py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <SettingsForm initialData={{
          profile: {
            name: profile.full_name || '',
            email: profile.email || '',
            bio: profile.bio || '',
          },
          notifications: {
            email: true,
            push: false,
            frequency: 'weekly',
          },
          privacy: {
            isPublic: false,
            showEmail: false,
          },
        }} />
      </div>
    </div>
  )
} 