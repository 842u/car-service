import { HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type CardHeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  children?: ReactNode;
};

export function CardHeading({
  headingLevel,
  className,
  children,
}: CardHeadingProps) {
  const Heading = headingLevel;

  return (
    <Heading className={twMerge('text-xl', className)}>{children}</Heading>
  );
}
