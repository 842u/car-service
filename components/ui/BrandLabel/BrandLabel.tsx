import { twMerge } from 'tailwind-merge';

import { BrandLogoMinimal } from '@/components/decorative/icons/BrandLogoMinimal';
import { smoochSans } from '@/utils/fonts';

import { LinkButton } from '../LinkButton/LinkButton';

type BrandLabelPops = {
  className?: string;
};

export function BrandLabel({ className }: BrandLabelPops) {
  return (
    <LinkButton
      aria-label="landing page"
      className={twMerge(
        'py-0 md:flex md:flex-row md:items-center md:gap-3',
        className,
      )}
      href="/"
      variant="transparent"
    >
      <BrandLogoMinimal className="stroke-accent-500 aspect-square h-full stroke-10 md:inline-block" />
      <span
        className={`hidden md:inline-block md:text-3xl md:font-medium md:whitespace-nowrap ${smoochSans.className}`}
      >
        Car Service
      </span>
    </LinkButton>
  );
}
