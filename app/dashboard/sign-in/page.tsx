import Link from 'next/link';

import { BrandLogoFull } from '@/components/decorative/icons/brand/BrandLogoFull';
import EmailAuthForm from '@/components/ui/EmailAuthForm/EmailAuthForm';
import { OAuthProviders } from '@/components/ui/OAuthProviders/OAuthProviders';
import { TextSeparator } from '@/components/ui/TextSeparator/TextSeparator';

export default function SignInPage() {
  return (
    <main>
      <div className="flex min-h-screen flex-col justify-center pt-16 lg:absolute lg:w-2/5 lg:border-r lg:border-alpha-grey-500 lg:bg-light-500 lg:shadow-xl lg:transition-[background-color] lg:dark:bg-dark-500">
        <section className="mx-auto flex h-full w-11/12 max-w-sm flex-col items-stretch justify-center gap-7">
          <div>
            <h1 className="mb-1 text-2xl">Welcome back</h1>
            <p className="text-sm text-light-900 dark:text-dark-200">
              Sign in to your account
            </p>
          </div>
          <OAuthProviders />
          <TextSeparator text="or" />
          <EmailAuthForm submitText="Sign Up" submitUrl="/api/auth/sign-up" />
          <p className="mx-auto text-sm text-light-900 dark:text-dark-200">
            <span>Don&apos;t have an account? </span>
            <Link
              className="text-dark-500 underline dark:text-light-500"
              href="/dashboard/sign-up"
            >
              Sign Up Now
            </Link>
          </p>
        </section>
      </div>

      <div
        aria-hidden
        className="fixed left-0 top-0 -z-10 hidden h-full w-full bg-gradient-to-bl from-light-500 to-light-600 dark:from-dark-450 dark:to-dark-900 lg:block"
      >
        <BrandLogoFull className="h-full w-full stroke-accent-500" />
      </div>
    </main>
  );
}
