'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea'; // Removed unused Textarea
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useProfileForm } from './useSettingsForm'; // Make sure this hook aligns with new schema
import type { ProfileSettingsSchema as ProfileFormData } from '@/lib/database/schemas/settings/profile';

interface ProfileFormProps {
  initialData?: Partial<ProfileFormData>;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const { form, onSubmit, isLoading } = useProfileForm(initialData);

  // Effect to reset the form when initialData changes *after* mount
  React.useEffect(() => {
    if (initialData) {
      console.log("[ProfileForm] Received updated initialData, resetting form:", initialData);
      form.reset(initialData);
    } else {
      // Optional: Handle case where data becomes null/undefined later, maybe reset to defaults?
      // console.log("[ProfileForm] initialData became null/undefined, resetting to defaults?");
      // form.reset(defaultProfileData); // If you have default values accessible here
    }
  }, [initialData, form.reset]); // Depend on initialData and form.reset

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              
              {/* First Name */}
              <FormField
                control={form.control}
                name="personal.firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="personal.lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="personal.phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="(123) 456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Removed Full Name, Email, Bio fields */}

            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Information</h3>

              {/* Company Name */}
              <FormField
                control={form.control}
                name="professional.companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Position */}
              <FormField
                control={form.control}
                name="professional.companyPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Your position/title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Removed Website field */}
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save changes'}
            </Button>

          </CardContent>
        </Card>
      </form>
    </Form>
  );
} 