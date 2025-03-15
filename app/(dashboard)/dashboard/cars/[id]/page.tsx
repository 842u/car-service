import { DashboardMain } from '@/components/ui/DashboardMain/DashboardMain';

type CarPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CarPage({ params }: CarPageProps) {
  const { id } = await params;

  return <DashboardMain>{id}</DashboardMain>;
}
