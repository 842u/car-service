import { AccountSettingsSection } from '@/components/sections/AccountSettingsSection/AccountSettingsSection';
import { DashboardMain } from '@/components/ui/DashboardMain/DashboardMain';

export default async function AccountPage() {
  return (
    <DashboardMain>
      <AccountSettingsSection />
    </DashboardMain>
  );
}
