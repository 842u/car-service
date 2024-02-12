import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

type SignUpLinkProps = {
  className?: string;
};

export function SignUpLink({ className }: SignUpLinkProps) {
  return (
    <p
      className={twMerge(
        'text-sm text-light-900 dark:text-dark-200',
        className,
      )}
    >
      <span>Don&apos;t have an account? </span>
      <Link
        className="text-dark-500 underline dark:text-light-500"
        href="/dashboard/sign-up"
      >
        Sign Up Now
      </Link>
    </p>
  );
}
