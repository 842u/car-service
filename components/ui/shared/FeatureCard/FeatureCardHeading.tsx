import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type FeatureCardHeadingProps = ComponentProps<'h1'> & {
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

export function FeatureCardHeading({
  className,
  children,
  headingLevel = 'h2',
  ...props
}: FeatureCardHeadingProps) {
  const HeadingTag = headingLevel;

  return (
    <HeadingTag className={twMerge('text-xl', className)} {...props}>
      {children}
    </HeadingTag>
  );
}
