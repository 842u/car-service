import type { ComponentProps } from 'react';

import type { HeadingLevel } from '@/ui/types/heading-level';

type LandingSectionHeadingProps = ComponentProps<'h1'> & {
  headingLevel: HeadingLevel;
};

export function LandingSectionHeading({
  children,
  headingLevel,
  ...props
}: LandingSectionHeadingProps) {
  const HeadingTag = headingLevel;

  return <HeadingTag {...props}>{children}</HeadingTag>;
}
