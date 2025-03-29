'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useSecurityForm } from './useSettingsForm';
import { useUser } from '@/lib/hooks/useUser';
import type { SecurityFormData } from '@/types/settings';

interface SecurityFormProps {
  initialData?: Partial<SecurityFormData>;
}

export function SecurityForm({ initialData }: SecurityFormProps) {
  const { form, onSubmit, isLoading } = useSecurityForm(initialData);
  const { user } = useUser();

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account security and authentication preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Password Change */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Change Password</h3>
              
              {/* Hidden username field for accessibility */}
              <input 
                type="text" 
                autoComplete="username" 
                value={user?.email || ""} 
                aria-hidden="true"
                className="hidden"
                readOnly
              />
              
              <FormField
                control={form.control}
                name="password.currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter current password" 
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password.newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter new password" 
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password.confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Confirm new password" 
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Two-Factor Authentication */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
              
              <FormField
                control={form.control}
                name="twoFactor.enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable 2FA</FormLabel>
                      <FormDescription>
                        Add an extra layer of security to your account
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={form.watch("twoFactor.enabled")}
                        onCheckedChange={(checked) => form.setValue("twoFactor.enabled", checked)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Session Management */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Session Management</h3>

              <FormField
                control={form.control}
                name="sessionManagement.rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Remember Me</FormLabel>
                      <FormDescription>
                        Keep me signed in on this device
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
            </div>

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