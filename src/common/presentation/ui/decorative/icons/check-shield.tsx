import type { SvgA11yProps } from '../svg-a11y/svg-a11y';
import { SvgA11y } from '../svg-a11y/svg-a11y';

export function CheckShieldIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="m18.3 27.2 5.4 5.4 9-12.6M25.5 3c-5.4 5.2-12.6 8-20 8a29 29 0 0 0 20 37 29 29 0 0 0 20-37h-.3c-7.6 0-14.6-3-19.7-8" />
    </SvgA11y>
  );
}
