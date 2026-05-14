import type { SvgA11yProps } from '../svg-a11y/svg-a11y';
import { SvgA11y } from '../svg-a11y/svg-a11y';

export function SearchIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M48 48 35 35m0 0A18.75 18.75 0 1 0 8.5 8.5 18.75 18.75 0 0 0 35 35" />
    </SvgA11y>
  );
}
