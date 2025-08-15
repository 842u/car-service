import { twMerge } from 'tailwind-merge';

import type { TextProps } from '../text/text';

export function SectionSubtext({ children, className, ...props }: TextProps) {
  return (
    <p className={twMerge('text-alpha-grey-900', className)} {...props}>
      {children}
    </p>
  );
}
