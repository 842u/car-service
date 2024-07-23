import { Avatar } from '@/components/ui/Avatar/Avatar';
import { PasswordResetForm } from '@/components/ui/PasswordResetForm/PasswordResetForm';
import { SettingsSection } from '@/components/ui/SettingsSection/SettingsSection';

export default async function AccountPage() {
  return (
    <main className="overflow-y-auto">
      <h1 className="mb-4 ml-4 mt-20 text-3xl md:ml-20">Account settings</h1>
      <div className="my-4 h-[1px] w-full bg-alpha-grey-200" />

      <section className="flex flex-col items-center justify-center gap-4">
        <SettingsSection headingText="Avatar">
          <Avatar />
        </SettingsSection>
        <SettingsSection headingText="Reset password">
          <div>
            <PasswordResetForm />
          </div>
        </SettingsSection>
      </section>
    </main>
  );
}
