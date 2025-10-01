import type { Route } from 'next';
import { redirect } from 'next/navigation';

import { SettingsSection } from '@/car/ui/sections/settings/settings';
import { DashboardMain } from '@/dashboard/ui/main/main';
import { dependencyContainer, dependencyTokens } from '@/di';

type CarPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CarPage({ params }: CarPageProps) {
  const { id } = await params;

  const authClient = await dependencyContainer.resolve(
    dependencyTokens.AUTH_SERVER_CLIENT,
  );

  const sessionResult = await authClient.getSession();

  if (!sessionResult.success) redirect('/dashboard/sign-in' satisfies Route);

  const { user } = sessionResult.data;

  const dbClient = await dependencyContainer.resolve(
    dependencyTokens.DATABASE_CLIENT_SERVER,
  );

  const ownershipResult = await dbClient.query(async (from) =>
    from('cars_ownerships')
      .select()
      .eq('car_id', id)
      .eq('owner_id', user.id)
      .single(),
  );

  if (!ownershipResult.success) redirect('/dashboard/cars' satisfies Route);

  return (
    <DashboardMain>
      <SettingsSection carId={id} />
    </DashboardMain>
  );
}
