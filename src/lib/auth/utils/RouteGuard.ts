export interface RoutePermission {
  resource: string;
  action: 'read' | 'write' | 'admin';
  roles?: string[];
} 