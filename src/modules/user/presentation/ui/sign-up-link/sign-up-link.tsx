import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

type SignUpLinkProps = {
  className?: string;
};

export function SignUpLink({ className }: SignUpLinkProps) {
  return (
    <p
      className={twMerge(
        'text-light-900 dark:text-dark-200 text-sm',
        className,
      )}
      data-testid="sign-up-link"
    >
      <span>Don&apos;t have an account? </span>
      <Link
        className="text-dark-500 dark:text-light-500 underline"
        href="/dashboard/sign-up"
      >
        Sign Up Now
      </Link>
    </p>
  );
}
