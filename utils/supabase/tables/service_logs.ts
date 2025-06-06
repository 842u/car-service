import { createClient } from '../client';

export async function getServiceLogsByCarId(carId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('service_logs')
    .select('*')
    .eq('car_id', carId)
    .order('service_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return data;
}

export async function deleteServiceLogById(id: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  const { data, error: serviceLogError } = await supabase
    .from('service_logs')
    .delete()
    .eq('id', id)
    .select('id')
    .single();

  if (serviceLogError) throw new Error(serviceLogError.message);

  if (!data) throw new Error('No service log was deleted.');

  return data;
}
