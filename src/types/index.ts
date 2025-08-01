import type { InfiniteData } from '@tanstack/react-query';
import type { JSX } from 'react';

import type { Database } from './supabase';

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

export type ServiceLog = Database['public']['Tables']['service_logs']['Row'];

export type ServiceCategory = Database['public']['Enums']['service_category'];

export type ServiceCategoryMapping = { [K in ServiceCategory]: K };

export const serviceCategoryMapping: ServiceCategoryMapping = {
  battery: 'battery',
  body: 'body',
  brakes: 'brakes',
  electrical: 'electrical',
  engine: 'engine',
  interior: 'interior',
  other: 'other',
  suspension: 'suspension',
  tires: 'tires',
};

export type CarsInfiniteQueryPageData = {
  data: (Car | null)[];
  nextPageParam: number | null;
};

export type CarsInfiniteQueryData = InfiniteData<CarsInfiniteQueryPageData>;

export type ButtonVariants =
  | 'default'
  | 'accent'
  | 'transparent'
  | 'transparentError'
  | 'error';

export type SectionVariants =
  | 'default'
  | 'transparent'
  | 'errorDefault'
  | 'errorTransparent';

export type FormVariants = 'default' | 'transparent' | 'raw';

export type InputVariants = 'default' | 'transparent' | 'error';
