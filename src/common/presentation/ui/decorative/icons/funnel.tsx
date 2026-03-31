import type { SvgA11yProps } from '../svg-a11y/svg-a11y';
import { SvgA11y } from '../svg-a11y/svg-a11y';

export function FunnelIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M25.5 3q10.35.01 20.2 1.7A2.8 2.8 0 0 1 48 7.44v2.6a5.6 5.6 0 0 1-1.65 3.98L32.77 27.6a5.6 5.6 0 0 0-1.65 3.98v7.32a5.6 5.6 0 0 1-3.1 5.03L19.88 48V31.58a5.6 5.6 0 0 0-1.65-3.98L4.65 14.02A5.6 5.6 0 0 1 3 10.05V7.44c0-1.35.96-2.52 2.3-2.74A121 121 0 0 1 25.5 3" />
    </SvgA11y>
  );
}
