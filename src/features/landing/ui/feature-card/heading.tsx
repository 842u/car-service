import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type HeadingProps = ComponentProps<'h1'> & {
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

export function Heading({
  className,
  children,
  headingLevel = 'h2',
  ...props
}: HeadingProps) {
  const HeadingTag = headingLevel;

  return (
    <HeadingTag className={twMerge('text-xl', className)} {...props}>
      {children}
    </HeadingTag>
  );
}
