import type { Route } from 'next';
import { redirect } from 'next/navigation';

import { OverviewSection } from '@/car/ui/sections/overview/overview';
import { DashboardMain } from '@/dashboard/ui/main/main';
import { createServerAuthClient } from '@/dependency/auth-client/server';
import { createServerDatabaseClient } from '@/dependency/database-client/server';

interface CarPageProps {
  params: Promise<{ id: string }>;
}

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
      <OverviewSection carId={id} />
    </DashboardMain>
  );
}
