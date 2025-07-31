import { twMerge } from 'tailwind-merge';

import { BrandSimpleIcon } from '@/icons/brand-simple';
import { LinkButton } from '@/ui/link-button/link-button';
import { smoochSans } from '@/utils/fonts';

type BrandLabelPops = {
  className?: string;
};

export function BrandLabel({ className }: BrandLabelPops) {
  return (
    <LinkButton
      aria-label="Car Service - Home"
      className={twMerge(
        'p-0 px-1 md:flex md:flex-row md:items-center md:gap-3',
        className,
      )}
      href="/"
      variant="transparent"
    >
      <BrandSimpleIcon className="stroke-accent-500 aspect-square h-full md:inline-block" />
      <span
        className={`hidden md:inline-block md:text-3xl md:font-medium md:whitespace-nowrap ${smoochSans.className}`}
      >
        Car Service
      </span>
    </LinkButton>
  );
}
