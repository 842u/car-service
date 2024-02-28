import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import { smoochSans } from '@/utils/fonts';

import { BrandLogoMinimal } from './BrandLogoMinimal';

type BrandLabelProps = {
  className?: string;
};

export function BrandLabel({ className }: BrandLabelProps) {
  return (
    <Link
      aria-label="landing page"
      className={twMerge(
        `flex h-full w-fit flex-row items-center justify-center gap-3 whitespace-nowrap text-3xl font-medium ${smoochSans.className}`,
        className,
      )}
      href="/"
    >
      <BrandLogoMinimal className="h-full stroke-accent-500 stroke-[10]" />
      <span className="hidden md:inline">Car Service</span>
    </Link>
  );
}
