import type { Route } from 'next';
import { redirect } from 'next/navigation';

import { SettingsSection } from '@/car/ui/sections/settings/settings';
import { DashboardMain } from '@/dashboard/ui/main/main';
import { dependencyContainer, DependencyTokens } from '@/dependency-container';

type CarPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CarPage({ params }: CarPageProps) {
  const { id } = await params;

  const dbClient = await dependencyContainer.resolve(
    DependencyTokens.DATABASE_SERVER_CLIENT,
  );

  const userResult = await dbClient.auth.getUser();

  if (!userResult.success) redirect('/dashboard/sign-in' satisfies Route);

  const { user } = userResult.data;

  const ownershipResult = await dbClient.transaction(async (from) =>
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
