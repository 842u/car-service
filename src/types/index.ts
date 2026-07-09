import type { InfiniteData } from '@tanstack/react-query';
import type { Database } from 'supabase/types/supabase';

export type User = Database['public']['Tables']['users']['Row'];

export type Car = Database['public']['Tables']['cars']['Row'];

export type CarOwnership =
  Database['public']['Tables']['cars_ownerships']['Row'];

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
