'use client';

import * as React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useSettingsForm } from './useSettingsForm';
import { ProfileForm } from './ProfileForm';
import { NotificationForm } from './NotificationForm';
import { PrivacyForm } from './PrivacyForm';
import { SecurityForm } from './SecurityForm';
import { AppearanceForm } from './AppearanceForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { SettingsFormData } from '@/types/settings';

interface SettingsFormProps {
  initialData?: Partial<SettingsFormData>
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const { form, isLoading, onSubmit } = useSettingsForm(initialData);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="profile">
              <ProfileForm />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationForm />
            </TabsContent>
            <TabsContent value="privacy">
              <PrivacyForm />
            </TabsContent>
            <TabsContent value="security">
              <SecurityForm />
            </TabsContent>
            <TabsContent value="appearance">
              <AppearanceForm />
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading || !form.formState.isDirty}
            className="w-32"
          >
            {isLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 