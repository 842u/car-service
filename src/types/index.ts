import type { Database } from 'supabase/types/supabase';

export type User = Database['public']['Tables']['users']['Row'];

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
