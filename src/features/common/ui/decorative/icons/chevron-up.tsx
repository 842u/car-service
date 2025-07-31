import type { SvgA11yProps } from '../svg-a11y/svg-a11y';
import { SvgA11y } from '../svg-a11y/svg-a11y';

export function ChevronUpIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="m1 37 24-24 24 24" />
    </SvgA11y>
  );
}
