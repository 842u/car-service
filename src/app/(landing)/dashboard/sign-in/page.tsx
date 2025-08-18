import { TextSeparator } from '@/common/presentation/decorative/text-separator/text-separator';
import { BrandFullIcon } from '@/icons/brand-full';
import { SignInForm } from '@/user/presentation/ui/forms/sign-in/sign-in';
import { OAuthProvidersSection } from '@/user/presentation/ui/sections/o-auth-providers/o-auth-providers';
import { SignUpLink } from '@/user/presentation/ui/sign-up-link/sign-up-link';

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
          <SignInForm />
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
