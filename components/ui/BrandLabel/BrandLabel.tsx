import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import { BrandLogoMinimal } from '@/components/decorative/icons/BrandLogoMinimal';
import { smoochSans } from '@/utils/fonts';

type BrandLabelProps = {
  className?: string;
};

export function BrandLabel({ className }: BrandLabelProps) {
  return (
    <Link
      aria-label="landing page"
      className={twMerge(
        `flex h-full w-fit flex-row items-center justify-center gap-3 text-3xl font-medium whitespace-nowrap ${smoochSans.className}`,
        className,
      )}
      href="/"
    >
      <BrandLogoMinimal className="stroke-accent-500 h-full stroke-10" />
      <span className="hidden md:inline">Car Service</span>
    </Link>
  );
}
