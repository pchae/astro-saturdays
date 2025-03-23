'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useNotificationsForm } from './useSettingsForm';
import type { NotificationFormData } from '@/lib/schemas/settings/notifications';

interface NotificationsFormProps {
  initialData?: Partial<NotificationFormData>;
}

const NOTIFICATION_CATEGORIES = ['security', 'account', 'updates', 'marketing', 'social'] as const;
const NOTIFICATION_CHANNELS = ['email', 'push', 'in_app', 'sms'] as const;
const NOTIFICATION_FREQUENCIES = ['immediately', 'daily', 'weekly', 'never'] as const;

export function NotificationsForm({ initialData }: NotificationsFormProps) {
  const { form, onSubmit, isLoading } = useNotificationsForm(initialData);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Global Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Global Notification Settings</CardTitle>
            <CardDescription>
              Manage your overall notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pause All Notifications */}
            <FormField
              control={form.control}
              name="globalSettings.pauseAll"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Pause All Notifications</FormLabel>
                    <FormDescription>
                      Temporarily disable all notifications
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

            {/* Do Not Disturb */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="globalSettings.doNotDisturb.enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Do Not Disturb</FormLabel>
                      <FormDescription>
                        Set quiet hours for notifications
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

              {form.watch("globalSettings.doNotDisturb.enabled") && (
                <div className="grid grid-cols-2 gap-4 pl-4">
                  <FormField
                    control={form.control}
                    name="globalSettings.doNotDisturb.startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="globalSettings.doNotDisturb.endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Digest Email */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="globalSettings.digestEmail.enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Digest Email</FormLabel>
                      <FormDescription>
                        Receive a summary of your notifications
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

              {form.watch("globalSettings.digestEmail.enabled") && (
                <div className="grid grid-cols-2 gap-4 pl-4">
                  <FormField
                    control={form.control}
                    name="globalSettings.digestEmail.frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="globalSettings.digestEmail.time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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

                    <FormField
                      control={form.control}
                      name={`preferences.${category}.frequency`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notification Frequency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {NOTIFICATION_FREQUENCIES.map((frequency) => (
                                <SelectItem key={frequency} value={frequency}>
                                  {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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