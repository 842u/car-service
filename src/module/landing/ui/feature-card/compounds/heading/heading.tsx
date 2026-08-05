import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import type { HeadingLevel } from '@/ui/types/heading-level';

type FeatureCardHeadingProps = ComponentProps<'h1'> & {
  headingLevel: HeadingLevel;
};

export function FeatureCardHeading({
  className,
  children,
  headingLevel,
  ...props
}: FeatureCardHeadingProps) {
  const HeadingTag = headingLevel;

  return (
    <HeadingTag className={twMerge('text-xl', className)} {...props}>
      {children}
    </HeadingTag>
  );
}
