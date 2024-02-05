import { Smooch_Sans } from 'next/font/google';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import { BrandLogoMinimal } from './BrandLogoMinimal';

const smoochSans = Smooch_Sans({
  subsets: ['latin'],
});

type BrandLabelProps = {
  className?: string;
};

export function BrandLabel({ className }: BrandLabelProps) {
  return (
    <Link
      className={twMerge(
        `flex h-full w-fit flex-row items-center justify-center gap-3 whitespace-nowrap text-3xl font-medium ${smoochSans.className}`,
        className,
      )}
      href="/"
    >
      <BrandLogoMinimal className="h-full stroke-accent-500 stroke-[10]" />
      Car Service
    </Link>
  );
}
