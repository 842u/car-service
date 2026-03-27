import type { SvgA11yProps } from '../svg-a11y/svg-a11y';
import { SvgA11y } from '../svg-a11y/svg-a11y';

export function FingerprintIcon({ ...props }: SvgA11yProps) {
  return (
    <SvgA11y
      {...props}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 50 50"
    >
      <path d="M16.2 6.1a18.4 18.4 0 0 1 26.2 6 19 19 0 0 1 2.6 9.7q0 11-3.9 20.7M11 11.5Q8 16 8 21.7q0 5.4-2.9 10m5 8.9c4.6-5.2 7.1-12 7.1-19q0-3.7 2.8-6.6a9.2 9.2 0 0 1 15.8 6.7l-.1 3.9m-9.2-4c0 9-3.1 17.7-8.9 24.5M34 34.7A47 47 0 0 1 27.8 48" />
    </SvgA11y>
  );
}
