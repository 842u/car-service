import type { SvgA11yProps } from '../svg-a11y/svg-a11y';
import { SvgA11y } from '../svg-a11y/svg-a11y';

export function GaugeIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M4.14 40A22 22 0 0 1 36 13.94M45.86 40a22 22 0 0 0-1.8-18M25 33l22-22" />
    </SvgA11y>
  );
}
