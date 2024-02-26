import { Section } from '@/components/sections/Section';
import { PasswordRemindForm } from '@/components/ui/PasswordRemindForm/PasswordRemindForm';
import { SignInLink } from '@/components/ui/SignInLink/SignInLink';

export default function ForgotPasswordPage() {
  return (
    <main>
      <Section
        aria-label="reset password"
        className="my-0 flex h-screen max-w-sm flex-col justify-center gap-7 md:my-0 lg:my-0"
      >
        <div>
          <h1 className="mb-1 text-2xl">Reset your password</h1>
          <p className="text-sm text-light-900 dark:text-dark-200">
            Type in your email and we&apos;ll send you a link to reset your
            password
          </p>
        </div>
        <PasswordRemindForm />
        <SignInLink className="mx-auto" />
      </Section>
    </main>
  );
}
