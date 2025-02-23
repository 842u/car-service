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

export const fuelTypesMapping = {
  '---': undefined,
  diesel: 'diesel',
  gasoline: 'gasoline',
  hybrid: 'hybrid',
  electric: 'electric',
  LPG: 'LPG',
  CNG: 'CNG',
  ethanol: 'ethanol',
  hydrogen: 'hydrogen',
} satisfies Record<
  Database['public']['Enums']['fuel'],
  Database['public']['Enums']['fuel']
> & { '---': undefined };

export const transmissionTypesMapping = {
  '---': undefined,
  manual: 'manual',
  automatic: 'automatic',
  CVT: 'CVT',
} satisfies Record<
  Database['public']['Enums']['transmission'],
  Database['public']['Enums']['transmission']
> & { '---': undefined };

export const driveTypesMapping = {
  '---': undefined,
  FWD: 'FWD',
  RWD: 'RWD',
  AWD: 'AWD',
  '4WD': '4WD',
} satisfies Record<
  Database['public']['Enums']['drive'],
  Database['public']['Enums']['drive']
> & { '---': undefined };

export type Fuel = keyof typeof fuelTypesMapping;
export type Transmission = keyof typeof transmissionTypesMapping;
export type Drive = keyof typeof driveTypesMapping;
