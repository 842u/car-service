import { twMerge } from 'tailwind-merge';

import { TextProps } from '../text/text';

export function Subtext({ children, className, ...props }: TextProps) {
  return (
    <p className={twMerge('text-alpha-grey-900', className)} {...props}>
      {children}
    </p>
  );
}
