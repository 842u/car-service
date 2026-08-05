import type { ComponentProps } from 'react';

import type { HeadingLevel } from '@/ui/types/heading-level';

import { useLandingSection } from '../../section';

type LandingSectionHeadingProps = ComponentProps<'h1'> & {
  headingLevel: HeadingLevel;
};

export function LandingSectionHeading({
  children,
  headingLevel,
  id,
  ...props
}: LandingSectionHeadingProps) {
  const { headingId } = useLandingSection();
  const HeadingTag = headingLevel;

  return (
    <HeadingTag id={id ?? headingId} {...props}>
      {children}
    </HeadingTag>
  );
}
