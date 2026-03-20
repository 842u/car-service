import { DashboardMain } from '@/dashboard/ui/main/main';
import { OverviewSection } from '@/dashboard/ui/sections/overview/overview';

export default function DashboardPage() {
  return (
    <DashboardMain>
      <OverviewSection />
    </DashboardMain>
  );
}
