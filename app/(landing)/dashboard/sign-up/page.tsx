import { BrandFullIcon } from '@/components/decorative/icons/BrandFullIcon';
import { TextSeparator } from '@/components/decorative/TextSeparator/TextSeparator';
import EmailAuthForm from '@/components/ui/forms/EmailAuthForm/EmailAuthForm';
import { OAuthProvidersSection } from '@/components/ui/sections/OAuthProvidersSection/OAuthProvidersSection';
import { SignInLink } from '@/components/ui/SignInLink/SignInLink';

export default function SignUpPage() {
  return (
    <main>
      <div className="lg:border-alpha-grey-300 lg:bg-light-500 lg:dark:bg-dark-500 flex min-h-screen flex-col justify-center pt-16 lg:absolute lg:w-2/5 lg:border-r lg:shadow-xl lg:transition-[background-color]">
        <section
          aria-label="Sign Up Authentication"
          className="mx-auto flex h-full w-11/12 max-w-sm flex-col items-stretch justify-center gap-7"
        >
          <h1>
            <p className="mb-1 text-2xl">Get started</p>
            <p className="text-light-900 dark:text-dark-200 text-sm">
              Create a new account
            </p>
          </h1>
          <OAuthProvidersSection />
          <TextSeparator text="or" />
          <EmailAuthForm type="sign-up" />
          <SignInLink className="mx-auto" />
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
