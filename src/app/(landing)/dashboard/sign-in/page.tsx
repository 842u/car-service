import EmailAuthForm from '@/auth/ui/forms/email-auth/email-auth';
import { OAuthProvidersSection } from '@/auth/ui/sections/o-auth-providers/o-auth-providers';
import { SignUpLink } from '@/auth/ui/sign-up-link/sign-up-link';
import { BrandFullIcon } from '@/ui/decorative/icons/brand-full';
import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';

export default function SignInPage() {
  return (
    <main>
      <div className="lg:border-alpha-grey-300 lg:bg-light-500 lg:dark:bg-dark-500 flex min-h-screen flex-col justify-center pt-16 lg:absolute lg:w-2/5 lg:border-r lg:shadow-xl lg:transition-[background-color]">
        <section
          aria-label="Sign In Authentication"
          className="mx-auto flex h-full w-11/12 max-w-sm flex-col items-stretch justify-center gap-7"
        >
          <h1>
            <p className="mb-1 text-2xl">Welcome back</p>
            <p className="text-light-900 dark:text-dark-200 text-sm">
              Sign in to your account
            </p>
          </h1>
          <OAuthProvidersSection />
          <TextSeparator text="or" />
          <EmailAuthForm type="sign-in" />
          <SignUpLink className="mx-auto" />
        </section>
      </div>

      <div
        aria-hidden
        className="from-light-500 to-light-600 dark:from-dark-450 dark:to-dark-900 fixed top-0 left-0 -z-10 hidden h-full w-full bg-linear-to-bl lg:block"
      >
        <BrandFullIcon className="stroke-accent-500 h-full w-full stroke-[0.1]" />
      </div>
    </main>
  );
}
