import Link from 'next/link';

import AuthForm from '@/components/ui/AuthForm/AuthForm';

export default async function SignUpPage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <h1 className="my-8 text-xl">Create a new account.</h1>
      <AuthForm className="w-full px-8" redirectTo="/api/auth/sign-up" />
      <p className="my-4 text-sm text-light-800">
        <span>Have an account? </span>
        <Link
          className="text-dark-500 underline dark:text-light-500"
          href="/dashboard/sign-in"
        >
          Sign In Now
        </Link>
      </p>
    </main>
  );
}
