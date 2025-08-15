import type { ComponentProps } from 'react';

export type TextProps = ComponentProps<'p'>;

export function SectionText({ children, ...props }: TextProps) {
  return <p {...props}>{children}</p>;
}
