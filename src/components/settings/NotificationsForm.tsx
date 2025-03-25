'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useNotificationForm } from './useSettingsForm';
import type { NotificationFormData } from '@/lib/schemas/settings/notifications';

interface NotificationsFormProps {
  initialData?: Partial<NotificationFormData>;
}

const NOTIFICATION_CATEGORIES = ['security', 'account', 'updates'] as const;
const NOTIFICATION_CHANNELS = ['email', 'push', 'in_app', 'sms'] as const;
// const NOTIFICATION_FREQUENCIES = ['immediately', 'daily', 'weekly', 'never'] as const;

export function NotificationsForm({ initialData }: NotificationsFormProps) {
  const { form, onSubmit, isLoading } = useNotificationForm(initialData);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Category Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Categories</CardTitle>
            <CardDescription>
              Customize notifications for each category
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {NOTIFICATION_CATEGORIES.map((category) => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-medium capitalize">{category}</h3>
                
                <FormField
                  control={form.control}
                  name={`preferences.${category}.enabled`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Notifications</FormLabel>
                        <FormDescription>
                          Receive notifications for {category}-related updates
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch(`preferences.${category}.enabled`) && (
                  <>
                    <FormField
                      control={form.control}
                      name={`preferences.${category}.channels`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notification Channels</FormLabel>
                          <div className="grid grid-cols-2 gap-4">
                            {NOTIFICATION_CHANNELS.map((channel) => (
                              <FormField
                                key={channel}
                                control={form.control}
                                name={`preferences.${category}.channels`}
                                render={({ field }) => (
                                  <FormItem
                                    key={channel}
                                    className="flex flex-row items-center space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(channel)}
                                        onCheckedChange={(checked) => {
                                          const currentValue = field.value || [];
                                          const newValue = checked
                                            ? [...currentValue, channel]
                                            : currentValue.filter((c) => c !== channel);
                                          field.onChange(newValue);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="capitalize">
                                      {channel.replace('_', ' ')}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
            ))}

            <div className="flex justify-start">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
} 