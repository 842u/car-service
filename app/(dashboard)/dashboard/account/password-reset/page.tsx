import { PasswordResetForm } from '@/components/ui/PasswordResetForm/PasswordResetForm';

export default function PasswordResetPage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <h1 className="my-8 text-xl">Reset password.</h1>
      <PasswordResetForm />
    </main>
  );
}
