import Link from 'next/link';

import { BrandLogoFull } from '@/components/decorative/icons/brand/BrandLogoFull';
import AuthForm from '@/components/ui/AuthForm/AuthForm';

export default function SignInPage() {
  return (
    <main className="relative h-screen">
      <div className="flex h-full w-full flex-col items-center justify-center bg-light-500 shadow-xl shadow-dark-700 transition-[background-color] dark:bg-dark-500 lg:w-2/5 lg:border-r lg:border-alpha-grey-500">
        <h1 className="my-8 text-xl">Sign in to your accout.</h1>
        <AuthForm
          className="w-4/5 max-w-sm"
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
      </div>
      <div
        aria-hidden
        className="absolute left-0 top-0 -z-10 hidden h-full w-full bg-gradient-to-bl from-light-500 to-light-600 dark:from-dark-500 dark:to-dark-900 lg:block"
      >
        <BrandLogoFull className="h-full w-full stroke-accent-500" />
      </div>
    </main>
  );
}
