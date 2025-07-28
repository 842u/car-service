import { Route } from 'next';
import { redirect } from 'next/navigation';

import { CarSettingsSection } from '@/components/ui/sections/CarSettingsSection/CarSettingsSection';
import { DashboardMain } from '@/features/dashboard/ui/DashboardMain/DashboardMain';
import { createClient } from '@/utils/supabase/server';

type CarPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CarPage({ params }: CarPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/dashboard/sign-in' satisfies Route);

  const { data: ownership } = await supabase
    .from('cars_ownerships')
    .select()
    .eq('car_id', id)
    .eq('owner_id', user.id)
    .single();

  if (!ownership) redirect('/dashboard/cars' satisfies Route);

  return (
    <DashboardMain>
      <CarSettingsSection carId={id} />
    </DashboardMain>
  );
}
