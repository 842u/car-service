import { BrandFullIcon } from '@/components/decorative/icons/BrandFullIcon';
import EmailAuthForm from '@/components/ui/EmailAuthForm/EmailAuthForm';
import { OAuthProviders } from '@/components/ui/OAuthProviders/OAuthProviders';
import { SignUpLink } from '@/components/ui/SignUpLink/SignUpLink';
import { TextSeparator } from '@/components/ui/TextSeparator/TextSeparator';

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
          <OAuthProviders />
          <TextSeparator text="or" />
          <EmailAuthForm type="sign-in" />
          <SignUpLink className="mx-auto" />
        </section>
      </div>

      <div
        aria-hidden
        className="from-light-500 to-light-600 dark:from-dark-450 dark:to-dark-900 fixed top-0 left-0 -z-10 hidden h-full w-full bg-linear-to-bl lg:block"
      >
        <BrandFullIcon className="stroke-accent-500 h-full w-full" />
      </div>
    </main>
  );
}
