import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

type SignInLinkProps = {
  className?: string;
};

export function SignInLink({ className }: SignInLinkProps) {
  return (
    <p
      className={twMerge(
        'text-light-900 dark:text-dark-200 text-sm',
        className,
      )}
      data-testid="sign-in-link"
    >
      <span>Have an account? </span>
      <Link
        className="text-dark-500 dark:text-light-500 underline"
        href="/dashboard/sign-in"
      >
        Sign In Now
      </Link>
    </p>
  );
}
