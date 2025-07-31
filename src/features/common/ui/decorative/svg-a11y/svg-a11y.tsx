import type { ComponentProps } from 'react';

export type SvgA11yProps = ComponentProps<'svg'>;

export function SvgA11y(props: SvgA11yProps) {
  return (
    <svg
      fill="none"
      stroke="#fff"
      {...props}
      aria-hidden
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      {props.children}
    </svg>
  );
}
