import CarDetailsSection from '@/components/ui/CarDetailsSection/CarDetailsSection';
import { DashboardMain } from '@/components/ui/DashboardMain/DashboardMain';

type CarPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CarPage({ params }: CarPageProps) {
  const { id } = await params;

  return (
    <DashboardMain className="px-5 pt-21">
      <CarDetailsSection id={id} />
    </DashboardMain>
  );
}
