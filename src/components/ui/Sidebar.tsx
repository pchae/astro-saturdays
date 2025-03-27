'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Settings,
  Calendar,
  Users,
  BarChart,
} from 'lucide-react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  user?: {
    name?: string;
    email?: string;
  };
}


// Admin navigation items
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Calendar', href: '/dashboard', icon: Calendar },
  { name: 'Invoices', href: '/', icon: Users },
  { name: 'Analytics', href: '/', icon: BarChart },
  { name: 'Settings', href: '/settings', icon: Settings },
];


export function Sidebar({ className, user, ...props }: SidebarProps) {
  // Functionality to get the current path
  // Get the path directly from the browser window object
  const [currentPath, setCurrentPath] = React.useState('');

  React.useEffect(() => {
    // Ensure this runs only on the client after mount
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []); // Empty depdency array ensures it runs once on mount


  return (
    <div className={cn("flex h-screen flex-col border-r border-blue-500 bg-background", className)} {...props}>
      {/* Logo */}
      <div className="px-6 py-5 border-0 border-red-100">
        <a href="/about" className="flex items-center no-underline">
          <span className="text-xl font-bold text-white">Saturdays.io TECH</span>
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isCurrent = currentPath === item.href || 
                             (item.href !== '/' && currentPath.startsWith(item.href));
          return (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-2 py-2 text-sm font-medium rounded-md text-white",
                isCurrent
                  ? "bg-blue-500/50 text-white"
                  : "text-gray-400 hover:bg-primary/5"
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </a>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="px-6 py-4 border-t border-blue-500">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-white" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{user?.name || 'User Name'}</p>
            <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 