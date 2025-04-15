import { InfiniteData } from '@tanstack/react-query';
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

export type RouteHandlerResponse<T = unknown> =
  | { error: null; data: T }
  | { data: null; error: { message: string } };

export type Profile = Database['public']['Tables']['profiles']['Row'];

export type Car = Database['public']['Tables']['cars']['Row'];

export type CarOwnership =
  Database['public']['Tables']['cars_ownerships']['Row'];

export type Fuel = Database['public']['Enums']['fuel'];
export type FuelMapping = { [K in Fuel]: K };

export type Transmission = Database['public']['Enums']['transmission'];
export type TransmissionMapping = { [K in Transmission]: K };

export type Drive = Database['public']['Enums']['drive'];
export type DriveMapping = { [K in Drive]: K };

export const fuelTypesMapping: FuelMapping = {
  diesel: 'diesel',
  gasoline: 'gasoline',
  LPG: 'LPG',
  hybrid: 'hybrid',
  electric: 'electric',
  CNG: 'CNG',
  ethanol: 'ethanol',
  hydrogen: 'hydrogen',
};

export const transmissionTypesMapping: TransmissionMapping = {
  manual: 'manual',
  automatic: 'automatic',
  CVT: 'CVT',
};

export const driveTypesMapping: DriveMapping = {
  FWD: 'FWD',
  RWD: 'RWD',
  AWD: 'AWD',
  '4WD': '4WD',
};

export type CarsInfiniteQueryPageData = {
  data: (Car | null)[];
  nextPageParam: number | null;
};

export type CarsInfiniteQueryData = InfiniteData<CarsInfiniteQueryPageData>;

export type ButtonVariants = 'default' | 'accent' | 'transparent' | 'error';

export type SectionVariants =
  | 'default'
  | 'transparent'
  | 'errorDefault'
  | 'errorTransparent';
