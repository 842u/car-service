import type { SvgA11yProps } from '../svg-a11y/svg-a11y';
import { SvgA11y } from '../svg-a11y/svg-a11y';

export function ChevronUpDownIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M11.67 35.67 25 49l13.33-13.33M11.67 14.33 25 1l13.33 13.33" />
    </SvgA11y>
  );
}
