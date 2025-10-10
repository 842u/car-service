import type { Route } from 'next';
import { redirect } from 'next/navigation';

import { SettingsSection } from '@/car/ui/sections/settings/settings';
import { DashboardMain } from '@/dashboard/ui/main/main';
import { createServerAuthClient } from '@/dependency/auth-client/server';
import { createServerDatabaseClient } from '@/dependency/database-client/server';

type CarPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CarPage({ params }: CarPageProps) {
  const { id } = await params;

  const authClient = await createServerAuthClient();

  const sessionResult = await authClient.authenticate();

  if (!sessionResult.success) redirect('/dashboard/sign-in' satisfies Route);

  const authIdentity = sessionResult.data;

  const dbClient = await createServerDatabaseClient();

  const ownershipResult = await dbClient.query(async (from) =>
    from('cars_ownerships')
      .select()
      .eq('car_id', id)
      .eq('owner_id', authIdentity.id)
      .single(),
  );

  if (!ownershipResult.success) redirect('/dashboard/cars' satisfies Route);

  return (
    <DashboardMain>
      <SettingsSection carId={id} />
    </DashboardMain>
  );
}
