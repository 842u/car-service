import Link from 'next/link';

import AuthForm from '@/components/ui/AuthForm/AuthForm';

export default async function SignInPage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <h1 className="my-8 text-xl">Sign in to your accout.</h1>
      <AuthForm
        strictPasswordCheck={false}
        submitText="Sign In"
        submitUrl="/api/auth/sign-in"
      />
      <p className="my-4 text-sm text-light-800">
        <span>Don&apos;t have an account? </span>
        <Link
          className="text-dark-500 underline dark:text-light-500"
          href="/dashboard/sign-up"
        >
          Sign Up Now
        </Link>
      </p>
    </main>
  );
}
