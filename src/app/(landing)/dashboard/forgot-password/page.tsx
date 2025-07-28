import { PasswordResetForm } from '@/features/auth/ui/PasswordResetForm/PasswordResetForm';
import { SignInLink } from '@/features/auth/ui/SignInLink/SignInLink';
import { LandingSection } from '@/features/landing/ui/LandingSection/LandingSection';

export default function ForgotPasswordPage() {
  return (
    <main>
      <LandingSection
        aria-label="reset password"
        className="my-0 flex h-screen max-w-sm flex-col justify-center gap-7 md:my-0 lg:my-0"
      >
        <div>
          <h1 className="mb-1 text-2xl">Reset your password</h1>
          <p className="text-light-900 dark:text-dark-200 text-sm">
            Type in your email and we&apos;ll send you a link to reset your
            password
          </p>
        </div>
        <PasswordResetForm />
        <SignInLink className="mx-auto" />
      </LandingSection>
    </main>
  );
}
