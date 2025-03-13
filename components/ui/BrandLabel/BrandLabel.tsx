import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import { BrandLogoMinimal } from '@/components/decorative/icons/BrandLogoMinimal';
import { smoochSans } from '@/utils/fonts';

type BrandLabelPops = {
  className?: string;
};

export function BrandLabel({ className }: BrandLabelPops) {
  return (
    <Link
      aria-label="landing page"
      className={twMerge('md:flex md:items-center md:gap-3', className)}
      href="/"
    >
      <BrandLogoMinimal className="stroke-accent-500 h-full stroke-10 md:inline-block" />
      <span
        className={`hidden md:inline-block md:text-3xl md:font-medium ${smoochSans.className}`}
      >
        Car Service
      </span>
    </Link>
  );
}
