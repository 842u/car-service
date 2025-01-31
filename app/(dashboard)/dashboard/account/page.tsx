import { AccountSettingsSection } from '@/components/sections/AccountSettingsSection/AccountSettingsSection';

export default async function AccountPage() {
  return (
    <main className="overflow-y-auto">
      <h1 className="mt-20 mb-4 ml-4 text-3xl md:ml-20">Account settings</h1>
      <div className="bg-alpha-grey-200 my-4 h-[1px] w-full" />
      <AccountSettingsSection />
    </main>
  );
}
