import { createClient } from '../supabase/client';

export async function getServiceLogsByCarId(carId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('service_logs')
    .select('*')
    .eq('car_id', carId);

  if (error) throw new Error(error.message);

  return data;
}
