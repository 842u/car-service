import { JSX } from 'react';

import { Database } from './supabase';

export type ToastType = 'info' | 'success' | 'error' | 'warning';

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

export type ToastAsset = {
  style: string;
  icon: JSX.Element;
};

export type RouteHandlerResponse =
  | { message: string; error: null }
  | { message: null; error: string };

export type UserProfile = Database['public']['Tables']['profiles']['Row'];
